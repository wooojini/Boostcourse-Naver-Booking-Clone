package kr.or.connect.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImage {
	@NonNull
	private String contentType;
	
	@NonNull
	private String createDate;
	
	@NonNull
	private boolean deleteFlag;
	
	@NonNull
	private int fileInfoId;
	
	@NonNull
	private String fileName;
	
	@NonNull
	private String modifyDate;
	
	@NonNull
	private int productId;
	
	@NonNull
	private int productImageId;
	
	@NonNull
	private String saveFileName;
	
	@NonNull
	private String type;
}
