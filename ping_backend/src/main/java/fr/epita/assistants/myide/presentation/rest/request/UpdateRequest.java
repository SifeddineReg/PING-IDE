package fr.epita.assistants.myide.presentation.rest.request;

public class UpdateRequest {
    public String path;
    public String content;

    public UpdateRequest() {
        path = "";
        content = "";
    }

    public UpdateRequest(String path, Integer from, Integer to, String content) {
        this.path = path;
        this.content = content;
    }
}
