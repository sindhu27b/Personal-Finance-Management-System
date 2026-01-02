package org.project.fintrack.controllers;

import org.project.fintrack.repository.UserRepository;
import org.project.fintrack.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController extends BaseController {

    private final ReportService reports;

    public ReportController(UserRepository users, ReportService reports) {
        super(users);
        this.reports = reports;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary(@RequestParam(required = false) String start,
                                       @RequestParam(required = false) String end) {
        var user = currentUser();
        LocalDate s = (start != null) ? LocalDate.parse(start) : LocalDate.now().withDayOfMonth(1);
        LocalDate e = (end != null) ? LocalDate.parse(end) : LocalDate.now();
        return reports.summary(user, s, e);
    }
}