package fr.epita.assistants;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Feature_Impl;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.service.ProjectService;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) {
        // Initialize the IDE with configuration
        ProjectService projectService = MyIde.init(new MyIde.Configuration(Path.of("indexFile"), Path.of("tempFolder")));
        
        // Load the project
        Project project = projectService.load(Path.of("./ping"));
        
        // Assuming there's a way to get a feature by its type, e.g., project.getFeature(...)
        // and Mandatory.Features.Maven.COMPILE is an accessible enum value for the compile feature
        Feature_Impl compileFeature = (Feature_Impl) project.getFeature(Mandatory.Features.Any.CLEANUP).get();
        
        // Execute the compile feature on the project
        Feature.ExecutionReport report = compileFeature.execute(project);
        
        // Check if the execution was successful
        if (report.isSuccess()) {
            System.out.println("Compilation succeeded.");
        } else {
            System.out.println("Compilation failed.");
        }
    }
}