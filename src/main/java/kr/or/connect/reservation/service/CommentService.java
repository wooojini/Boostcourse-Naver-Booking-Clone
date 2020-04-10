package kr.or.connect.reservation.service;

import java.util.List;

import kr.or.connect.reservation.dto.Comment;
import kr.or.connect.reservation.dto.CommentImage;
import kr.or.connect.reservation.dto.FileInfo;

public interface CommentService {
	public List<Comment> getCommentsByDisplayInfoId(int displayInfoId);
	public double getAveScoreByDisplayInfoId(int displayInfoId);
	public List<CommentImage> getCommentImages(int displayInfoId, int commentId);
	public FileInfo getFileInfo(int displayInfoId, int commentId);
}
