package dev.twotough.springlab.todo.service;

import dev.twotough.springlab.todo.dto.CreateTodoRequest;
import dev.twotough.springlab.todo.dto.UpdateTodoRequest;
import dev.twotough.springlab.todo.model.Todo;

import java.util.List;

public interface TodoService {
    Todo create(CreateTodoRequest req);
    Todo getById(Long id);
    List<Todo> list(Long folderId); // folderId nullable -> list all or filtered
    Todo update(Long id, UpdateTodoRequest req);
    Todo assignToFolder(Long id, Long folderId);
    Todo clearFolder(Long id);
    void delete(Long id);
}