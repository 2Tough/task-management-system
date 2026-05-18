package dev.twotough.springlab.todo.mapper;

import dev.twotough.springlab.todo.dto.CreateTodoRequest;
import dev.twotough.springlab.todo.dto.TodoResponse;
import dev.twotough.springlab.todo.model.Todo;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TodoMapper {

    public TodoResponse toResponse(Todo todo) {
        if (todo == null) return null;
        Long folderId = null;
        String folderTitle = null;
        if (todo.getFolder() != null) {
            folderId = todo.getFolder().getId();
            folderTitle = todo.getFolder().getTitle();
        }
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isDone(),
                folderId,
                folderTitle
        );
    }

    public List<TodoResponse> toResponseList(List<Todo> todos) {
        return todos.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Si quieres convertir CreateTodoRequest -> Todo (sin setear id ni folder)
    public Todo fromCreateRequest(CreateTodoRequest req) {
        if (req == null) return null;
        Todo todo = new Todo(req.getTitle());
        todo.setDescription(req.getDescription());
        if (req.getDone() != null) todo.setDone(req.getDone());
        // NOTA: no seteamos folder aquí si prefieres que el service lo haga (recomendado)
        return todo;
    }
}