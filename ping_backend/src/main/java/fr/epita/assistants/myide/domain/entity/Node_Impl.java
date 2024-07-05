package fr.epita.assistants.myide.domain.entity;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class Node_Impl implements Node {
    private Path path;
    private Types type;

    public Node_Impl(Path path, Types type)
    {
        this.path = path;
        this.type = type;
    }
    @Override
    public Path getPath() {
        return path;
    }

    @Override
    public Type getType() {
        return type;
    }

    @Override
    public List<Node> getChildren() {
        List<Node> children = new ArrayList<>();
        if (this.isFolder())
        {
            Stream<Path> paths = null;
            try {
                paths = Files.list(path);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            for (Path child_path: paths.toList())
            {
                if (Files.isDirectory(child_path))
                    children.add(new Node_Impl(child_path, Types.FOLDER));
                else if (Files.isRegularFile(child_path))
                    children.add(new Node_Impl(child_path, Types.FILE));
            }

            paths.close();
        }
        return children;
    }
}
