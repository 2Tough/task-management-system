package dev.twotough.springlab.todo.repository;

import dev.twotough.springlab.todo.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    // por ahora no hace falta nada más; dejamos los métodos CRUD estándar
}