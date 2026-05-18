package dev.twotough.springlab.todo.service;

import dev.twotough.springlab.todo.dto.CreateTodoRequest;
import dev.twotough.springlab.todo.dto.UpdateTodoRequest;
import dev.twotough.springlab.todo.model.Todo;
import dev.twotough.springlab.todo.repository.FolderRepository;
import dev.twotough.springlab.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class TodoServiceImpl implements TodoService {

    private final TodoRepository repo;
    private final FolderRepository folderRepository;

    public TodoServiceImpl(TodoRepository repo, FolderRepository folderRepository) {
        this.repo = repo;
        this.folderRepository = folderRepository;
    }

    @Override
    public Todo create(CreateTodoRequest req) {
        if (req.getTitle() == null || req.getTitle().isBlank()) {
            throw new IllegalArgumentException("title is required");
        }

        Todo todo = new Todo(req.getTitle());
        todo.setDescription(req.getDescription());
        if (req.getDone() != null) todo.setDone(req.getDone());

        if (req.getFolderId() != null) {
            var folderOpt = folderRepository.findById(req.getFolderId());
            if (folderOpt.isEmpty()) {
                throw new IllegalArgumentException("folderId not found: " + req.getFolderId());
            }
            todo.setFolder(folderOpt.get());
        }

        return repo.save(todo);
    }

    @Override
    public Todo getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<Todo> list(Long folderId) {
        if (folderId == null) return repo.findAll();
        return repo.findByFolderId(folderId);
    }
    @Override
    public Todo update(Long id, UpdateTodoRequest req) {
        var opt = repo.findById(id);
        if (opt.isEmpty()) throw new NoSuchElementException("Todo not found: " + id);
        Todo todo = opt.get();

        if (req.getTitle() != null) {
            if (req.getTitle().isBlank()) throw new IllegalArgumentException("title cannot be blank");
            todo.setTitle(req.getTitle());
        }

        if (req.getDescription() != null) {
            todo.setDescription(req.getDescription());
        }

        if (req.getDone() != null) {
            todo.setDone(req.getDone());
        }

        if (req.getFolderId() != null) {
            var folderOpt = folderRepository.findById(req.getFolderId());
            if (folderOpt.isEmpty()) throw new IllegalArgumentException("folderId not found: " + req.getFolderId());
            todo.setFolder(folderOpt.get());
        }

        // if req.getFolderId() is null -> keep existing folder
        return repo.save(todo);
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NoSuchElementException("Todo not found: " + id);
        repo.deleteById(id);
    }
}