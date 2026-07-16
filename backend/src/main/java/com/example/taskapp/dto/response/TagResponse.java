package com.example.taskapp.dto.response;

import com.example.taskapp.model.Tag;

import lombok.Data;

@Data
public class TagResponse {

    private Long id;
    private String name;

    public static TagResponse from(Tag tag){
        TagResponse res = new TagResponse();
        res.id = tag.getId();
        res.name = tag.getName();
        return res;
    }
}
