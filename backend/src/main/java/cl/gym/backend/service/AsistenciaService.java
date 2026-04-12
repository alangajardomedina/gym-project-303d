package cl.gym.backend.service;
import java.util.List;

import org.springframework.stereotype.Service;

import cl.gym.backend.model.Asistencia;
import cl.gym.backend.repository.AsistenciaRepository;

@Service
public class AsistenciaService {

    private final AsistenciaRepository repository;

    public AsistenciaService(AsistenciaRepository repository) {
        this.repository = repository;
    }

    public List<Asistencia> listar() {
        return repository.findAll();
    }

    public Asistencia guardar(Asistencia asistencia) {
        return repository.save(asistencia);
    }

    public List<Asistencia> porUsuario(String rut) {
        return repository.findByUsuarioRut(rut);
    }
}