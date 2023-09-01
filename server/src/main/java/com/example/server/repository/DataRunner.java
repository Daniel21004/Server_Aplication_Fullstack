package com.example.server.repository;

import com.example.server.domain.Server;
import com.example.server.enumeration.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataRunner implements CommandLineRunner {
    private final ServerRepository serverRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Registering demo servers");

        List<Server> demoServerList = List.of(
                new Server(null, "192.168.1.160", "Ubuntu Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server1.png", Status.SERVER_UP),
                new Server(null, "192.168.1.58", "Fedora Linux", "16 GB", "Dell Tower", "http://localhost:8080/server/image/server2.png", Status.SERVER_UP),
                new Server(null, "192.168.1.21", "MS 2008", "32 GB", "Web Server", "http://localhost:8080/server/image/server3.png", Status.SERVER_DOWN),
                new Server(null, "192.168.1.14", "Read Hat Enterprise Linux", "64 GB", "Mail Server", "http://localhost:8080/server/image/server4.png", Status.SERVER_DOWN)
        );

        serverRepository.saveAll(demoServerList);
    }
}
