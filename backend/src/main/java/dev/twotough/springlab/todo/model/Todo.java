package dev.twotough.springlab.todo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
public class Todo {
    @Getter
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Column(nullable = false)
    private String title;

    @Setter
    private String description;
    private boolean done = false;

    // Constructor requerido por JPA
    protected Todo() {}

    // Constructor cómodo para crear
    public Todo(String title) {
        this.title = title;
    }

    // Constructor completo (opcional)
    public Todo(String title, String description, boolean done) {
        this.title = title;
        this.description = description;
        this.done = done;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }

    // GETTERS que faltaban (añadidos)
    public String getDescription() {
        return this.description;
    }

    public boolean isDone() {
        return this.done;
    }

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "folder_id")
    private Folder folder;
}