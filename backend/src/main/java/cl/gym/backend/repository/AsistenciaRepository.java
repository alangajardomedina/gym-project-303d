package cl.gym.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.gym.backend.model.Asistencia;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByUsuarioRut(String rut);

}