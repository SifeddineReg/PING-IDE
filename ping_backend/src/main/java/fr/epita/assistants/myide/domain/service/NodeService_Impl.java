package fr.epita.assistants.myide.domain.service;

import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.Node_Impl;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.util.Comparator;
import java.nio.file.StandardCopyOption;

public class NodeService_Impl implements NodeService {

    public Node update_file(String path, String content) {
        System.out.println(path + '\n');
        Path abs_path = Paths.get(path);
        
        try {
            Files.write(abs_path, content.getBytes(StandardCharsets.UTF_8));
            return new Node_Impl(abs_path, Node.Types.FILE);
        } catch (IOException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    private String readContent(Path filePath) throws IOException {
        return new String(Files.readAllBytes(filePath), StandardCharsets.UTF_8);
    }

    private String updateContent(String existingContent, int from, int to, byte[] insertedContent) {
        String before = existingContent.substring(0, from);
        String after = existingContent.substring(to);
        return before + new String(insertedContent, StandardCharsets.UTF_8) + after;
    }

    private void writeContent(Path filePath, String content) throws IOException {
        Files.write(filePath, content.getBytes(StandardCharsets.UTF_8));
    }

    public boolean delete(final Node node) {
        if (node == null) {
            return false;
        }

        Path path = node.getPath();
        try {
            if (node.isFile()) {
                return Files.deleteIfExists(path);
            } else if (node.isFolder()) {
                return deleteDirectory(path);
            }
        } catch (IOException e) {
            //e.printStackTrace();
            return false;
        }
        return false;
    }

    private boolean deleteDirectory(Path dir) throws IOException {
        Files.walk(dir)
            .sorted(Comparator.reverseOrder())
            .forEach(path -> {
                try {
                    Files.delete(path);
                } catch (IOException e) {
                    e.printStackTrace();
                    throw new RuntimeException("delete node: failed to delete " + path);
                }
            });
        return !Files.exists(dir);
    }

    public Node create(final Node folder, final String name, final Node.Type type) {
        if (!folder.isFolder()) {
            throw new IllegalArgumentException("create node: parent node is not a folder");
        }

        Path newFilePath = folder.getPath().resolve(name);

        try {
            if (type.equals(Node.Types.FILE)) {
                Files.createFile(newFilePath);
            } else if (type.equals(Node.Types.FOLDER)) {
                Files.createDirectory(newFilePath);
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("create node: failed to create new node");
        }
        if (type == Node.Types.FILE)
            return new Node_Impl(newFilePath, Node.Types.FILE);
        return new Node_Impl(newFilePath, Node.Types.FOLDER);
    }

    public Node move(final Node nodeToMove, final Node destinationFolder) {
        if (nodeToMove == null || destinationFolder == null) {
            throw new IllegalArgumentException("move node: node and destination folder must not be null.");
        }

        if (!destinationFolder.isFolder()) {
            throw new IllegalArgumentException("mode node: destination must be a folder.");
        }

        Path sourcePath = nodeToMove.getPath();
        Path destinationPath = destinationFolder.getPath().resolve(sourcePath.getFileName());

        try {
            Files.move(sourcePath, destinationPath, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        } catch (IOException e) {
            throw new IllegalArgumentException("move node : failed to move node.");
        }
        if (nodeToMove.getType() == Node.Types.FILE)
                return new Node_Impl(destinationPath, Node.Types.FILE);
            return new Node_Impl(destinationPath, Node.Types.FOLDER);
    }

    @Override
    public Node update(Node node, int from, int to, byte[] insertedContent) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }
}
