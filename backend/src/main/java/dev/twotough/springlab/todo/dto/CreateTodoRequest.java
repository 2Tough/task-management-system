package dev.twotough.springlab.todo.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateTodoRequest {
    @NotBlank
    private String title;
    private String description;
    private Boolean done;
    private Long folderId;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getDone() { return done; }
    public void setDone(Boolean done) { this.done = done; }
    public Long getFolderId() {
        return folderId;
    }

    public void setFolderId(Long folderId) {
        this.folderId = folderId;
    }
}