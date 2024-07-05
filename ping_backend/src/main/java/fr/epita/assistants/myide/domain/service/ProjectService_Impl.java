package fr.epita.assistants.myide.domain.service;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

import javax.validation.constraints.NotNull;

import fr.epita.assistants.MyIde;
import fr.epita.assistants.myide.domain.entity.*;

public class ProjectService_Impl implements fr.epita.assistants.myide.domain.service.ProjectService
{
    private NodeService my_node_service_;
    private Path indexFile;
    private Path tempFolder;

    public ProjectService_Impl(MyIde.Configuration configuration) {
        this.my_node_service_ = new NodeService_Impl();
        this.indexFile = configuration.indexFile();
        this.tempFolder = configuration.tempFolder();
    }

    public ProjectService_Impl() {
        this.my_node_service_ = new NodeService_Impl();
    }

    @Override
    @NotNull 
    public Project load(@NotNull final Path root){
        Node_Impl tmp = new Node_Impl(root, root.toFile().isDirectory() ? Node.Types.FOLDER : Node.Types.FILE);

        Set<Aspect> aspects = new HashSet<>();
        List<Feature> features = new ArrayList<>();
        aspects.add(new Aspect_Impl(Aspect.Types.ANY));

        if (root.toFile().isDirectory())
        {
            for (Node child : tmp.getChildren())
            {
                if (child.getPath().getFileName().toString().equals(".git"))
                {
                    aspects.add(new Aspect_Impl(Aspect.Types.GIT));
                }

                if (child.getPath().getFileName().toString().equals("pom.xml"))
                {
                    aspects.add(new Aspect_Impl(Aspect.Types.MAVEN));
                }
            }
        }

        for (Aspect aspect : aspects)
        {
            Aspect_Impl aspectImpl = (Aspect_Impl) aspect;
            features.addAll(aspectImpl.getFeatureList());
        }

        Project_Impl result = new Project_Impl(tmp, aspects, features);
        return result;
    }

    @Override
    @NotNull
    public Feature.ExecutionReport execute(@NotNull final Project project, @NotNull final Feature.Type featureType,final Object... params){
        Feature_Impl tmp = new Feature_Impl(featureType);
        return tmp.execute(project,params);
    }

    @Override
    @NotNull
    public NodeService getNodeService(){
        return my_node_service_;
    }

}
