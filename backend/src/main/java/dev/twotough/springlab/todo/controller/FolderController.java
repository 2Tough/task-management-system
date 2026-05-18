package dev.twotough.springlab.todo.controller;

import dev.twotough.springlab.todo.model.Folder;
import dev.twotough.springlab.todo.repository.FolderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderRepository folderRepository;

    public FolderController(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    @PostMapping
    public ResponseEntity<Folder> create(@RequestBody Folder f) {
        if (f.getTitle() == null || f.getTitle().isBlank()) return ResponseEntity.badRequest().build();

        Folder toSave = new Folder(f.getTitle());
        Folder saved = folderRepository.save(toSave);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();

        return ResponseEntity.created(location).body(saved);
    }

    @GetMapping
    public List<Folder> list() {
        return folderRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        var opt = folderRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        folderRepository.delete(opt.get());
        return ResponseEntity.noContent().build();
    }
}