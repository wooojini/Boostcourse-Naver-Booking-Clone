package kr.or.connect.reservation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Request Params Not valid")
public class RequestArgumentNotValidException extends RuntimeException {

}
