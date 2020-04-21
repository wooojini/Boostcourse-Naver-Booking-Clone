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
public class CommentImage {
  @NonNull
  private String contentType;

  @NonNull
  private String createDate;

  @NonNull
  private boolean deleteFlag;

  @NonNull
  private int fileId;

  @NonNull
  private String fileName;

  @NonNull
  private int imageId;

  @NonNull
  private String modifyDate;

  @NonNull
  private int reservationInfoId;

  @NonNull
  private int reservationUserCommentId;

  @NonNull
  private String saveFileName;
}
