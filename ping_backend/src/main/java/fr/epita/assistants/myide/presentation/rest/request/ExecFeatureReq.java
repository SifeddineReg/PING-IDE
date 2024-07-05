package fr.epita.assistants.myide.presentation.rest.request;

import java.util.List;

public class ExecFeatureReq {
    public String feature;
    public List<String> params;
    public String project;

    public ExecFeatureReq() {
        feature = "";
        params = List.of();
        project = "";
    }

    public ExecFeatureReq(String feature, List<String> params, String project) {
        this.feature = feature;
        this.params = params;
        this.project = project;
    }
}
