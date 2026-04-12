package cl.gym.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import cl.gym.backend.model.Usuario;
import cl.gym.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public Usuario guardar(Usuario usuario) {
        return repository.save(usuario);
    }

    public Usuario buscar(String rut) {
        return repository.findById(rut).orElse(null);
    }

    public void eliminar(String rut) {
        repository.deleteById(rut);
    }
}