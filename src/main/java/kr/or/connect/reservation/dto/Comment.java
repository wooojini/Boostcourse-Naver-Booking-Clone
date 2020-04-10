package kr.or.connect.reservation.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Comment {
	@NonNull
	private String comment;
	
	@NonNull
	private int commentId;	
	
	@NonNull
	private List<CommentImage> commentImages;
	
	@NonNull
	private String createDate;
	
	@NonNull
	private String modifyDate;	
	
	@NonNull
	private int productId;
	
	@NonNull
	private String reservationDate;
	
	@NonNull
	private String reservationEmail;
	
	@NonNull
	private int reservationInfoId;
	
	@NonNull
	private String reservationName;
	
	@NonNull
	private String reservationTelephone;
	
	@NonNull
	private double score;
}
