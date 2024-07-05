package fr.epita.assistants.myide.domain.entity;

import fr.epita.assistants.myide.domain.entity.Mandatory.Features;

import javax.validation.constraints.NotNull;
import java.util.List;

public class Aspect_Impl implements Aspect{
    private final Aspect.Type type;

    public Aspect_Impl(Aspect.Type type) {
        this.type = type;
    }

    @Override
    public Aspect.Type getType() {
        return type;
    }

    @Override
    public @NotNull List<Feature> getFeatureList() {
        if (type instanceof Aspect.Types) {
            if (type == Aspect.Types.MAVEN)
                return List.of(
                    new Feature_Impl(Features.Maven.COMPILE),
                    new Feature_Impl(Features.Maven.CLEAN),
                    new Feature_Impl(Features.Maven.TEST),
                    new Feature_Impl(Features.Maven.PACKAGE),
                    new Feature_Impl(Features.Maven.INSTALL),
                    new Feature_Impl(Features.Maven.EXEC),
                    new Feature_Impl(Features.Maven.TREE)
                );
            else if (type == Aspect.Types.GIT)
                return List.of(
                    new Feature_Impl(Features.Git.PULL),
                    new Feature_Impl(Features.Git.ADD),
                    new Feature_Impl(Features.Git.COMMIT),
                    new Feature_Impl(Features.Git.PUSH)
                );
            else if (type == Aspect.Types.ANY)
                return List.of(
                    new Feature_Impl(Features.Any.CLEANUP),
                    new Feature_Impl(Features.Any.DIST),
                    new Feature_Impl(Features.Any.SEARCH)
                );
            else
                return List.of();
        }
        else
            return List.of();
    }
}
