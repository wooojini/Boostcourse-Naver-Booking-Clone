package kr.or.connect.reservation.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import kr.or.connect.reservation.dto.ReservationInfo;
import kr.or.connect.reservation.service.ReservationService;

@Controller
@SessionAttributes("reservationEmail")
public class ReservationLoginController {
	@Autowired
	ReservationService reservationInfoService;
	
	@GetMapping(path = "/bookingLoginForm")
	public String bookingLoginForm() {
		return "bookingLoginForm";
	}
	
	@GetMapping(path = "/bookingLogin")
	public String bookingLogin(
			@RequestParam(name = "resrv_email", required = true)String reservationEmail,
			HttpSession session) {
		
		List<ReservationInfo> reservationInfo = reservationInfoService.getReservationInfoByEmail(reservationEmail);
		if(!reservationInfo.isEmpty()) {
			session.setAttribute("reservationEmail", reservationEmail);
		}
		
		return "redirect:/myreservation";
	}
}
