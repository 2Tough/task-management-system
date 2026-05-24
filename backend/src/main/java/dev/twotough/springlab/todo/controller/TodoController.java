package dev.twotough.springlab.todo.controller;

import dev.twotough.springlab.todo.dto.CreateTodoRequest;
import dev.twotough.springlab.todo.dto.TodoResponse;
import dev.twotough.springlab.todo.dto.UpdateTodoRequest;
import dev.twotough.springlab.todo.mapper.TodoMapper;
import dev.twotough.springlab.todo.model.Todo;
import dev.twotough.springlab.todo.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;
    private final TodoMapper todoMapper;

    public TodoController(TodoService todoService, TodoMapper todoMapper) {
        this.todoService = todoService;
        this.todoMapper = todoMapper;
    }

    @PostMapping
    public ResponseEntity<TodoResponse> create(@Valid @RequestBody CreateTodoRequest req) {
        Todo saved = todoService.create(req);
        TodoResponse resp = todoMapper.toResponse(saved);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();

        return ResponseEntity.created(location).body(resp);
    }

    /**
     * List all todos, or filter by folderId si se pasa como query param.
     * GET /api/todos
     * GET /api/todos?folderId=3
     */
    @GetMapping
    public List<TodoResponse> list(@RequestParam(required = false) Long folderId) {
        List<Todo> todos = todoService.list(folderId);
        return todoMapper.toResponseList(todos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getById(@PathVariable Long id) {
        Todo todo = todoService.getById(id);
        if (todo == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(todoMapper.toResponse(todo));
    }


    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> update(@PathVariable Long id, @RequestBody UpdateTodoRequest req) {
        Todo updated = todoService.update(id, req);
        return ResponseEntity.ok(todoMapper.toResponse(updated));
    }

    @PutMapping("/{id}/folder/{folderId}")
    public ResponseEntity<TodoResponse> assignToFolder(@PathVariable Long id, @PathVariable Long folderId) {
        Todo updated = todoService.assignToFolder(id, folderId);
        return ResponseEntity.ok(todoMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}/folder")
    public ResponseEntity<TodoResponse> clearFolder(@PathVariable Long id) {
        Todo updated = todoService.clearFolder(id);
        return ResponseEntity.ok(todoMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        todoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}