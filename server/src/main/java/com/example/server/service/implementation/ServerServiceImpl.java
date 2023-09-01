package com.example.server.service.implementation;

import com.example.server.domain.Server;
import com.example.server.enumeration.Status;
import com.example.server.repository.ServerRepository;
import com.example.server.service.ServerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.InetAddress;
import java.util.Collection;
import java.util.Optional;
import java.util.Random;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class ServerServiceImpl implements ServerService {
    private final ServerRepository serverRepository;

    @Override
    public Server createServer(Server server) {
        log.info("Saving new server: {}", server.getName());
        server.setImageUrl(generateImageUrl());
        return serverRepository.save(server);
    }

    @Override
    public Server pingServer(String ipAddress) throws IOException {
        log.info("Pinging server IP: {}", ipAddress);
        Server server = serverRepository.findByIpAddress(ipAddress);
        InetAddress address = InetAddress.getByName(ipAddress);
        server.setStatus(address.isReachable(10000) ? Status.SERVER_UP : Status.SERVER_DOWN);
        return serverRepository.save(server);
    }

    @Override
    public Collection<Server> getAllServersByLimit(int limit) {
        log.info("Fetching all servers");
        return serverRepository.findAll(PageRequest.of(0, limit)).toList();
    }

    @Override
    public Optional<Server> getServer(Long id) {
        log.info("Fetching server by ID: {}", id);
        return serverRepository.findById(id); // Return the "server"?
    }

    @Override
    public Server updateServer(Server server) {
        log.info("Update server: {}", server.getName());
        return serverRepository.save(server);
    }

    @Override
    public Boolean deleteServer(Long id) {
        log.info("Delete server by ID: {}", id);
        serverRepository.deleteById(id);
        return true;
    }

    private String generateImageUrl() {
        String[] imageNames = {"server1.png", "server2.png", "server3.png", "server4.png"};
        //? The "new Random().nextInt(4)" generates a random number since 0 to 3 because the limit is [4(bound)-1]
        //? Here, we are making a request to getServerImage controller method
        return ServletUriComponentsBuilder.fromCurrentContextPath().path("/server/image/" + imageNames[new Random().nextInt(4)]).toUriString();
    }
}