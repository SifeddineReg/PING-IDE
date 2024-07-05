package fr.epita.assistants.myide.presentation.rest;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.Node_Impl;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.service.NodeService_Impl;
import fr.epita.assistants.myide.domain.service.ProjectService_Impl;
import fr.epita.assistants.myide.presentation.rest.request.ExecFeatureReq;
import fr.epita.assistants.myide.presentation.rest.request.MoveRequest;
import fr.epita.assistants.myide.presentation.rest.request.Request;
import fr.epita.assistants.myide.presentation.rest.request.UpdateRequest;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import fr.epita.assistants.myide.utils.Logger;
import javax.swing.JFileChooser;
// import org.eclipse.jgit.util.IO;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;

@Path("/api")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MyIdeEndpoint {

    class FileContent {
        private String name;
        private String content;

        public FileContent(String name, String content) {
            this.name = name;
            this.content = content;
        }

        // Getters
        public String getName() {
            return name;
        }

        public String getContent() {
            return content;
        }

        // Setters
        public void setName(String name) {
            this.name = name;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }

    public String removeFirstChar(String s){
        return s.substring(1);
     }

    @GET @Path("/hello")
    public Response helloWorld()
    {
        Logger.log("Saying hello !");
        return Response.ok("{\"message\": \"Hello World!\"}").build();
    }

    @POST @Path("/open/project")
    public Response open_project(Request req)
    {
        Logger.log("Opening project");
        return Response.ok("Project opened").build();

        // JFileChooser fileChooser = new JFileChooser();
        // fileChooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
        // int result = fileChooser.showOpenDialog(null);

        // if (result == JFileChooser.APPROVE_OPTION) {
        //     File selectedFile = fileChooser.getSelectedFile();
        //     String fileName = selectedFile.getName();

        //     String absolutePath = selectedFile.getAbsolutePath();
        //     JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
        //     jsonBuilder.add("name", fileName)
        //                .add("absolutePath", absolutePath);

        //     JsonObject jsonObject = jsonBuilder.build();
        //     return Response.ok(jsonObject.toString(), MediaType.APPLICATION_JSON).build();
        // } else {
        //     return Response.status(Response.Status.BAD_REQUEST)
        //                    .entity("Project selection cancelled")
        //                    .build();
        // }
    }

    @GET @Path("/open/file")
    public Response open_file()
    {
        JFileChooser fileChooser = new JFileChooser();
        int result = fileChooser.showOpenDialog(null);

        if (result == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            String fileName = selectedFile.getName();
            String absolutePath = selectedFile.getAbsolutePath();
            StringBuilder contentBuilder = new StringBuilder();

            try (BufferedReader reader = new BufferedReader(new FileReader(selectedFile))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    contentBuilder.append(line).append("\n");
                }
            } catch (IOException e) {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                               .entity("File reading error: " + e.getMessage())
                               .build();
            }

            String content = contentBuilder.toString();

            FileContent fileContent = new FileContent(fileName, content);
            JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
            jsonBuilder.add("name", fileContent.getName())
                       .add("absolutePath", absolutePath)
                       .add("content", fileContent.getContent());

            JsonObject jsonObject = jsonBuilder.build();
            return Response.ok(jsonObject.toString(), MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity("File selection cancelled")
                           .build();
        }
    }

    @POST @Path("/create/file")
    public Response create_file(Request req)
    {
        Logger.log("Creating file: " + req.path);

        if (req.path.charAt(0)=='/')
            req.path = removeFirstChar(req.path);
        
        java.nio.file.Path proj = java.nio.file.Paths.get(req.path);
        java.nio.file.Path parent = proj.getParent();
        Node folder = null;
        if (parent != null) {
            folder = new Node_Impl(proj.getParent(), Node.Types.FOLDER);
        } else {
            java.nio.file.Path current_folder = java.nio.file.Paths.get(System.getProperty("user.dir"));
            folder = new Node_Impl(current_folder, Node.Types.FOLDER);
        }

        if (Files.exists(proj))
        {
            Logger.logError("File already exists: " + req.path);
            return Response.status(Response.Status.CONFLICT).entity("File already exists").build();
        }
        NodeService_Impl nodeService = new NodeService_Impl();
        nodeService.create(folder,proj.getFileName().toString(), Node.Types.FILE);
        return Response.ok("File created: " + req.path).build();
    }

    @POST @Path("/create/folder")
    public Response create_folder(Request req) {
        Logger.log("Creating folder: " + req.path);

        if (req.path.charAt(0)=='/')
            req.path = removeFirstChar(req.path);
        
        java.nio.file.Path proj = java.nio.file.Paths.get(req.path);
        //Logger.log("path is "+ proj);
        java.nio.file.Path parent = proj.getParent();
        Node folder = null;
        if (parent != null) {
            folder = new Node_Impl(proj.getParent(), Node.Types.FOLDER);
        } else {
            java.nio.file.Path current_folder = java.nio.file.Paths.get(System.getProperty("user.dir"));
            folder = new Node_Impl(current_folder, Node.Types.FOLDER);
        }
        NodeService_Impl nodeService = new NodeService_Impl();

        if (Files.exists(proj))
        {
            Logger.logError("Folder already exists: " + req.path);
            return Response.status(Response.Status.CONFLICT).entity("Folder already exists").build();
        }
        nodeService.create(folder,proj.getFileName().toString(), Node.Types.FOLDER);
        return Response.ok("Folder created: " + req.path).build();
    }

    @POST @Path("/delete/file")
    public Response delete_file(Request req)
    {
        Logger.log("Deleting file: " + req.path);

        if (req.path.charAt(0)=='/')
            req.path = removeFirstChar(req.path);
        java.nio.file.Path proj = java.nio.file.Paths.get(req.path);
        Node file = new Node_Impl(proj, Node.Types.FILE);
        NodeService_Impl nodeService = new NodeService_Impl();
        boolean del = nodeService.delete(file);

        if (del)
            return Response.ok("File deleted").build();
        else if (!Files.exists(proj)){
            Logger.logError("File don't exists: " + req.path);
            return Response.status(Response.Status.NOT_FOUND).entity("File don't exists").build();
        }
        else {
            Logger.logError("Error while deleting file: " + req.path);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error while deleting file").build();
        }
    }

    @POST @Path("/delete/folder")
    public Response delete_folder(Request req)
    {
        Logger.log("Deleting folder: " + req.path);

        if (req.path.charAt(0)=='/')
            req.path = removeFirstChar(req.path);
        java.nio.file.Path proj = java.nio.file.Paths.get(req.path);
        Node folder = new Node_Impl(proj, Node.Types.FOLDER);
        NodeService_Impl nodeService = new NodeService_Impl();
        boolean del = nodeService.delete(folder);

        if (del)
            return Response.ok("Folder deleted").build();
        else if (!Files.exists(proj)){
            Logger.logError("Folder don't exists: " + req.path);
            return Response.status(Response.Status.NOT_FOUND).entity("Folder don't exists").build();
        }
        else if (Files.isDirectory(proj) && proj.toFile().list().length > 0) {
            Logger.logError("Folder is not empty: " + req.path);
            return Response.status(Response.Status.BAD_REQUEST).entity("Folder is not empty").build();
        }
        else {
            Logger.logError("Error while deleting folder: " + req.path);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error while deleting folder").build();
        }
    }

    @POST @Path("execFeature")
    public Response exec_feature(ExecFeatureReq req)
    {
        Logger.log("executing feature: " + req.feature + ", on project: " + req.project + ", with params: " + req.params);

        if (req.project.charAt(0)=='/')
            req.project = removeFirstChar(req.project);
        ProjectService_Impl projectService = new ProjectService_Impl();
        Project proj = projectService.load(java.nio.file.Paths.get(req.project));
        if (proj == null)
        {
            Logger.logError("Project not found: " + req.project);
            return Response.status(Response.Status.NOT_FOUND).entity("Project not found").build();
        }

        String feature = req.feature.toUpperCase();
        if (feature.equals("COMPILE"))
        {
            Feature compile = proj.getFeature(Mandatory.Features.Maven.COMPILE).get();
            compile.execute(proj, req.params.toArray());
        } else if (feature.equals("CLEAN"))
        {
            Feature clean = proj.getFeature(Mandatory.Features.Maven.CLEAN).get();
            clean.execute(proj, req.params.toArray());
        } else if (feature.equals("TEST"))
        {
            Feature test = proj.getFeature(Mandatory.Features.Maven.TEST).get();
            test.execute(proj, req.params.toArray());
        } else if (feature.equals("PACKAGE"))
        {
            Feature package_ = proj.getFeature(Mandatory.Features.Maven.PACKAGE).get();
            package_.execute(proj, req.params.toArray());
        } else if (feature.equals("INSTALL"))
        {
            Feature install = proj.getFeature(Mandatory.Features.Maven.INSTALL).get();
            install.execute(proj, req.params.toArray());
        } else if (feature.equals("EXEC"))
        {
            Feature exec = proj.getFeature(Mandatory.Features.Maven.EXEC).get();
            exec.execute(proj, req.params.toArray());
        } else if (feature.equals("TREE"))
        {
            Feature tree = proj.getFeature(Mandatory.Features.Maven.TREE).get();
            tree.execute(proj, req.params.toArray());
        } else if (feature.equals("ADD"))
        {
            Feature add = proj.getFeature(Mandatory.Features.Git.ADD).get();
            add.execute(proj, req.params.toArray());
        } else if (feature.equals("COMMIT"))
        {
            Feature commit = proj.getFeature(Mandatory.Features.Git.COMMIT).get();
            commit.execute(proj, req.params.toArray());
        } else if (feature.equals("PUSH"))
        {
            Feature push = proj.getFeature(Mandatory.Features.Git.PUSH).get();
            push.execute(proj, req.params.toArray());
        } else if (feature.equals("PULL"))
        {
            Feature pull = proj.getFeature(Mandatory.Features.Git.PULL).get();
            pull.execute(proj, req.params.toArray());
        } else if (feature.equals("CLEANUP"))
        {
            Feature cleanup = proj.getFeature(Mandatory.Features.Any.CLEANUP).get();
            cleanup.execute(proj, req.params.toArray());
        } else if (feature.equals("DIST"))
        {
            Feature dist = proj.getFeature(Mandatory.Features.Any.DIST).get();
            dist.execute(proj, req.params.toArray());
        } else if (feature.equals("SEARCH"))
        {
            Feature search = proj.getFeature(Mandatory.Features.Any.SEARCH).get();
            search.execute(proj, req.params.toArray());
        } else
        {
            Logger.logError("Feature not found: " + feature);
            return Response.status(Response.Status.NOT_FOUND).entity("Feature not found").build();
        }
        return Response.ok("Feature executed").build();
    }

    @POST @Path("/move")
    public Response move(MoveRequest req)
    {
        Logger.log("moving from: " + req.src + " to " + req.dst);

        if (req.src.charAt(0)=='/')
            req.src = removeFirstChar(req.src);

        if (req.dst.charAt(0)=='/')
            req.dst = removeFirstChar(req.dst);
        java.nio.file.Path start = java.nio.file.Paths.get(req.src);
        java.nio.file.Path end = java.nio.file.Paths.get(req.dst);
        Node movement = new Node_Impl(start, Files.isDirectory(start) ? Node.Types.FOLDER : Node.Types.FILE);
        Node end_folder = new Node_Impl(end, Node.Types.FOLDER);
        NodeService_Impl nodeService = new NodeService_Impl();

        try {
            nodeService.move(movement, end_folder);
            return Response.ok("Moved").build();
        }
        catch (IllegalArgumentException e) {
            Logger.logError("Error while moving: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error while moving: " + e.getMessage()).build();
        }
    }

    @POST @Path("/update")
    public Response update(UpdateRequest req)
    {
        NodeService_Impl nodeService = new NodeService_Impl();

        try {
            nodeService.update_file(req.path, req.content);
            return Response.ok("Updated: " + req.content).build();
        }
        catch (IllegalArgumentException e) {
            Logger.logError("Error while updating: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error while updating: " + e.getMessage()).build();
        }
    }
}