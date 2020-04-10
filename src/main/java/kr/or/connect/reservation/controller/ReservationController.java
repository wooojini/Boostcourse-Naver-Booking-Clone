package kr.or.connect.reservation.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ReservationController {
	@GetMapping(path = "/detail")
	public String detail(
			@RequestParam(name = "id", required = true, defaultValue = "0")int displayInfoId,
			ModelMap model) {
		model.addAttribute("displayInfoId", displayInfoId);
		return "detail";
	}
	
	@GetMapping(path = "/review")
	public String review(
			@RequestParam(name = "id", required = true, defaultValue = "0")int displayInfoId,
			ModelMap model) {
		model.addAttribute("displayInfoId", displayInfoId);
		return "review";
	}
	
	@GetMapping(path = "/reserve")
	public String reserve(@RequestParam(name = "id", required = true, defaultValue = "0")int displayInfoId,
			ModelMap model) {
		model.addAttribute("displayInfoId", displayInfoId);
		return "reserve";
	}
	
	@GetMapping(path = "/myreservation")
	public String myreservation() {
		return "myreservation";
	}
	
	@GetMapping(path="/reviewWrite")
	public String revireWrite() {
		return "reviewWriteForm";
	}
}
