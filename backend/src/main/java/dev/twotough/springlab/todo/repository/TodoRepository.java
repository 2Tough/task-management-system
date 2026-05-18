package dev.twotough.springlab.todo.repository;

import dev.twotough.springlab.todo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByFolderId(Long folderId);
}