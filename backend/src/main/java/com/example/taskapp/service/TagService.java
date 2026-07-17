package com.example.taskapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.taskapp.dto.request.TagRequest;
import com.example.taskapp.dto.response.TagResponse;
import com.example.taskapp.exception.ForbiddenException;
import com.example.taskapp.exception.ResourceNotFoundException;
import com.example.taskapp.model.Tag;
import com.example.taskapp.model.User;
import com.example.taskapp.repository.TagRepository;
import com.example.taskapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    public List<TagResponse> getAllTags(Long userId){
        return tagRepository.findByUserId(userId)
            .stream().map(TagResponse::from).toList();
    }

    public TagResponse createTag(Long userId, TagRequest req){
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));
        
        Tag tag = new Tag();
        tag.setName(req.getName());
        tag.setColor(req.getColor() != null ? req.getColor() : "#8b5cf6");
        tag.setUser(user);

        return TagResponse.from(tagRepository.save(tag));
    }

    public TagResponse updateTag(Long userId, Long tagId, TagRequest req){
        Tag tag = tagRepository.findById(tagId)
            .orElseThrow(() -> new ResourceNotFoundException("タグが見つかりません"));

            if (!tag.getUser().getId().equals(userId)) {
                throw new ForbiddenException("権限がありません");
            }

            tag.setName(req.getName());
            if (req.getColor() != null) {
                tag.setColor(req.getColor());
            }
            return TagResponse.from(tagRepository.save(tag));
    }

    public void deleteTag(Long userId, Long tagId){
        Tag tag = tagRepository.findById(tagId)
            .orElseThrow(() -> new ResourceNotFoundException("タグが見つかりません"));
        
        if(!tag.getUser().getId().equals(userId)){
            throw new ForbiddenException("権限がありません");
        }

        tagRepository.delete(tag);
    }

}
