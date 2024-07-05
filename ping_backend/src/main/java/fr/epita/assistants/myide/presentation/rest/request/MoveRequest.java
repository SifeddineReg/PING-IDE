package fr.epita.assistants.myide.presentation.rest.request;

public class MoveRequest {
    public String src;
    public String dst;

    public MoveRequest() {
        src = "";
        dst = "";
    }

    public MoveRequest(String src, String dst) {
        this.src = src;
        this.dst = dst;
    }
}
