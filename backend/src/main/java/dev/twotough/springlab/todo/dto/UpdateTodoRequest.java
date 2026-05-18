package dev.twotough.springlab.todo.dto;

public class UpdateTodoRequest {
    private String title;       // optional: if null -> don't change
    private String description; // optional
    private Boolean done;       // optional
    private Long folderId;      // optional

    public UpdateTodoRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getDone() { return done; }
    public void setDone(Boolean done) { this.done = done; }

    public Long getFolderId() { return folderId; }
    public void setFolderId(Long folderId) { this.folderId = folderId; }
}