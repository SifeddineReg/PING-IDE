package fr.epita.assistants.myide.domain.entity;

import java.util.Optional;
import java.util.Set;
import java.util.List;

public class Project_Impl implements fr.epita.assistants.myide.domain.entity.Project {
    private final Node root;
    private final Set<Aspect> aspects;
    private final List<Feature> features;

    public Project_Impl(Node root, Set<Aspect> aspects, List<Feature> features)
    {
        this.root = root;
        this.aspects = aspects == null ? Set.of() : aspects;
        this.features = features == null ? List.of() : features;
    }

    @Override
    public Node getRootNode() {
        return root;
    }

    @Override
    public Set<Aspect> getAspects() {
        return aspects;
    }

    @Override
    public Optional<Feature> getFeature(Feature.Type featureType) {
        for (Feature feature : features)
        {
            if (feature.type() == featureType)
                return Optional.of(feature);
        }
        return Optional.empty();
    }
}
