package cl.gym.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.gym.backend.model.Asistencia;
import cl.gym.backend.service.AsistenciaService;

@RestController
@RequestMapping("/api/asistencias")
@CrossOrigin("*")
public class AsistenciaController {

    private final AsistenciaService service;

    public AsistenciaController(AsistenciaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Asistencia> listar() {
        return service.listar();
    }

    @PostMapping
    public Asistencia guardar(@RequestBody Asistencia asistencia) {
        return service.guardar(asistencia);
    }

    @GetMapping("/usuario/{rut}")
    public List<Asistencia> porUsuario(@PathVariable String rut) {
        return service.porUsuario(rut);
    }
}