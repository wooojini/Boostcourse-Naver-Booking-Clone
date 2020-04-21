package kr.or.connect.reservation.dto.response;

import javax.validation.constraints.Positive;
import kr.or.connect.reservation.dto.CommentImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponse {
  @NonNull
  private String comment;

  @NonNull
  @Positive
  private int commentId;

  @NonNull
  private CommentImage commentImage;

  @NonNull
  private String createDate;

  @NonNull
  private String modifyDate;

  @NonNull
  @Positive
  private int productId;

  @NonNull
  @Positive
  private int reservationInfoId;

  @NonNull
  private int score;
}
