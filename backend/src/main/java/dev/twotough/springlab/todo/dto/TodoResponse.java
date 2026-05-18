package dev.twotough.springlab.todo.dto;

public class TodoResponse {
    private Long id;
    private String title;
    private String description;
    private boolean done;
    private Long folderId;    // opcional: id de la carpeta asociada
    private String folderTitle; // opcional: nombre de la carpeta (útil para mostrar)

    public TodoResponse() {}

    public TodoResponse(Long id, String title, String description, boolean done, Long folderId, String folderTitle) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.done = done;
        this.folderId = folderId;
        this.folderTitle = folderTitle;
    }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public Long getFolderId() { return folderId; }
    public void setFolderId(Long folderId) { this.folderId = folderId; }

    public String getFolderTitle() { return folderTitle; }
    public void setFolderTitle(String folderTitle) { this.folderTitle = folderTitle; }
}