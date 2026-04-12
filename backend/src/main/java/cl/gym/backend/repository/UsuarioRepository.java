package cl.gym.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.gym.backend.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
}