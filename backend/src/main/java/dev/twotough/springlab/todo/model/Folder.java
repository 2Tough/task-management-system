package dev.twotough.springlab.todo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    // Relación bidireccional: un Folder tiene muchos Todos.
    // Cascade ALL + orphanRemoval = true => los todos serán eliminados al borrar la carpeta.
    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Todo> todos = new ArrayList<>();

    protected Folder() {}

    public Folder(String title) {
        this.title = title;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public List<Todo> getTodos() { return todos; }

    // helpers opcionales para mantener ambas caras de la relación
    public void addTodo(Todo todo) {
        todos.add(todo);
        todo.setFolder(this);
    }

    public void removeTodo(Todo todo) {
        todos.remove(todo);
        todo.setFolder(null);
    }
}