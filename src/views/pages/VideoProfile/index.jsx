import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

// MATERIAL DONE
// import { Typography } from "@mui/material";
import { StyledTypography } from 'views/styledComponents';
import Profile from "views/components/Profile";
import VideoIntroduction from "./VideoIntroduction";
import CustomPlayerV4 from "views/components/video-player/web/CustomPlayerV4";
import RecommendedVideo from "views/components/video-player/web/RecommendedVideo";
import CommentV4 from 'views/pages/AlbumProfile/CommentV4';
import App from 'views/pages/AlbumProfile/Tree/App';
import RedditApp from 'views/pages/AlbumProfile/Tree/RedditApp';

// import MovieImageGridList from "./MovieImageGridList";
// import MovieVideoList from "./MovieVideoList";
// import MovieCastGridList from "./MovieCastGridList";
// import Recommendations from "./Recommendations";

// CORE
import { selectors } from "core/reducers/index";
import { verifyCachedData } from "core/utils";
import { fetchMovie } from "core/actions";

const REQUIRED_FIELDS = ["tagline"];

import api_dataV2 from 'views/utils/api_data.json';

const api_data = [
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/%40onlymilitarycontent%3Avideo%3A7076002202753584390.mp4",
    url: "https://cdn.coverr.co/videos/coverr-desert-in-california-329/1080p.mp4",
    viewsCount: "1M",
    likesCount: "30K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/jet.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1618595714505-cfc44411d4d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-dunes-4546/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-gate-bridge-at-sunset-5420/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/049/801/original/DJI_0104.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/048/776/original/refinery01.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/r_Mvoq7Oliyrkej0t/videoblocks-v1-0002_dji_0748_r47ojmzkq__ae26123a57af1f09e97017a982c56a24__P360.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/%40onlymilitarycontent%3Avideo%3A7076002202753584390.mp4",
    url: "https://cdn.coverr.co/videos/coverr-desert-in-california-329/1080p.mp4",
    viewsCount: "1M",
    likesCount: "30K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/jet.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1618595714505-cfc44411d4d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-dunes-4546/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-gate-bridge-at-sunset-5420/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/049/801/original/DJI_0104.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/048/776/original/refinery01.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/r_Mvoq7Oliyrkej0t/videoblocks-v1-0002_dji_0748_r47ojmzkq__ae26123a57af1f09e97017a982c56a24__P360.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/%40onlymilitarycontent%3Avideo%3A7076002202753584390.mp4",
    url: "https://cdn.coverr.co/videos/coverr-desert-in-california-329/1080p.mp4",
    viewsCount: "1M",
    likesCount: "30K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/jet.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1618595714505-cfc44411d4d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-dunes-4546/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-gate-bridge-at-sunset-5420/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/049/801/original/DJI_0104.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/048/776/original/refinery01.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/r_Mvoq7Oliyrkej0t/videoblocks-v1-0002_dji_0748_r47ojmzkq__ae26123a57af1f09e97017a982c56a24__P360.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/%40onlymilitarycontent%3Avideo%3A7076002202753584390.mp4",
    url: "https://cdn.coverr.co/videos/coverr-desert-in-california-329/1080p.mp4",
    viewsCount: "1M",
    likesCount: "30K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/jet.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1618595714505-cfc44411d4d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-dunes-4546/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-gate-bridge-at-sunset-5420/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/049/801/original/DJI_0104.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/048/776/original/refinery01.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/r_Mvoq7Oliyrkej0t/videoblocks-v1-0002_dji_0748_r47ojmzkq__ae26123a57af1f09e97017a982c56a24__P360.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/%40onlymilitarycontent%3Avideo%3A7076002202753584390.mp4",
    url: "https://cdn.coverr.co/videos/coverr-desert-in-california-329/1080p.mp4",
    viewsCount: "1M",
    likesCount: "30K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/jet.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1618595714505-cfc44411d4d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-dunes-4546/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-gate-bridge-at-sunset-5420/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/049/801/original/DJI_0104.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/048/776/original/refinery01.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/r_Mvoq7Oliyrkej0t/videoblocks-v1-0002_dji_0748_r47ojmzkq__ae26123a57af1f09e97017a982c56a24__P360.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/%40onlymilitarycontent%3Avideo%3A7076002202753584390.mp4",
    url: "https://cdn.coverr.co/videos/coverr-desert-in-california-329/1080p.mp4",
    viewsCount: "1M",
    likesCount: "30K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/jet.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1618595714505-cfc44411d4d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-dunes-4546/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-gate-bridge-at-sunset-5420/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/049/801/original/DJI_0104.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/048/776/original/refinery01.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/r_Mvoq7Oliyrkej0t/videoblocks-v1-0002_dji_0748_r47ojmzkq__ae26123a57af1f09e97017a982c56a24__P360.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/%40onlymilitarycontent%3Avideo%3A7076002202753584390.mp4",
    url: "https://cdn.coverr.co/videos/coverr-desert-in-california-329/1080p.mp4",
    viewsCount: "1M",
    likesCount: "30K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/jet.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1618595714505-cfc44411d4d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-dunes-4546/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-gate-bridge-at-sunset-5420/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/049/801/original/DJI_0104.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/048/776/original/refinery01.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/r_Mvoq7Oliyrkej0t/videoblocks-v1-0002_dji_0748_r47ojmzkq__ae26123a57af1f09e97017a982c56a24__P360.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/%40onlymilitarycontent%3Avideo%3A7076002202753584390.mp4",
    url: "https://cdn.coverr.co/videos/coverr-desert-in-california-329/1080p.mp4",
    viewsCount: "1M",
    likesCount: "30K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/jet.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1618595714505-cfc44411d4d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-dunes-4546/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-gate-bridge-at-sunset-5420/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/049/801/original/DJI_0104.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/048/776/original/refinery01.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/r_Mvoq7Oliyrkej0t/videoblocks-v1-0002_dji_0748_r47ojmzkq__ae26123a57af1f09e97017a982c56a24__P360.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },




]

function VideoProfile() {
  const dispatch = useDispatch();
  const { videoId } = useParams();
  // const isFetching = useSelector(state =>
  //   selectors.selectIsFetchingVideo(state, videoId)
  // );
  // const video = useSelector(state => selectors.selectVideo(state, videoId));
  //
  // useEffect(() => {
  //   dispatch(fetchVideo(videoId, REQUIRED_FIELDS));
  // }, [videoId, dispatch]);

  // const loading = isFetching || !verifyCachedData(video, REQUIRED_FIELDS);

  // return (
  //   <Profile
  //     // loading={loading}
  //     introduction={<VideoIntroduction videoId={videoId} url={api_data[5].url} />}
  //     main={
  //       <>
  //
  //
  //
  //         <VideoWrapper>
  //           {api_data.map((item, index) =>
  //               // <StyledVideoCard
  //               // <VideoCard
  //               // <VideoPlayer
  //               // <CustomPlayer
  //               // <CustomPlayerV2
  //               // <CustomPlayerV3
  //               <CustomPlayerV4
  //               // <CustomBardPlayer
  //               // <VideoPlayerV2
  //                 url={item.url}
  //                 key={index}
  //                 // light={item.url}
  //                 light={item.thumbNail}
  //                 viewsCount={item.viewsCount}
  //                 likesCount={item.likesCount}
  //               />
  //             )
  //           }
  //         </VideoWrapper>
  //       </>
  //     }
  //
  //   />
  // );

  const comments = [
    {
      id: 1,
      userpic: '',
      username: '',
      text: '“The best place to hide is in plain sight.”– Edgar Allan Poe, (The Purloined Letter)',
      replies: [
        {
          id: 2,
          userpic: '',
          username: '',
          text: 'I had to read that short story for a sociology seminar. Pretty good read!',
          replies: [
            {
              id: 3,
              userpic: '',
              username: '',
              text: 'I read it in 6th grade because it was one of the highest “reading level” books while not being forever long. I passed the comprehension test to my teachers delight and I found Edgar Allan Poe.',
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      userpic: '',
      username: '',
      text: 'How is this possible?.',
      replies: [
        {
          id: 2,
          userpic: '',
          username: '',
          text: `
          OP’s title is inaccurate, that’s why.

          Escobar did not become wanted in the United States until the late 1980s. He wouldn’t have had any restrictions traveling to and around the US in 1981.
          `,
          replies: [
            {
              id: 3,
              userpic: '',
              username: '',
              text: 'BREAK OUT THE PITCHFORKS, STAT!',
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      userpic: '',
      username: '',
      text: `He wasn't that notable to the US when this picture was taken`,
      replies: [
        {
          id: 2,
          userpic: '',
          username: '',
          text: `Although he was a criminal by 1981, he wasn't even wanted in Colombia at that time, much less the U.S.`,
          replies: [
            {
              id: 3,
              userpic: '',
              username: '',
              text: `Poor guy nobody wanted him :(`,
              replies: [],
            },
          ],
        },
        {
          id: 2,
          userpic: '',
          username: '',
          text: `Don't let reality ruin a good reddit clickbait.`,
          replies: [
            {
              id: 3,
              userpic: '',
              username: '',
              text: `this app is being held together by the same couple dozen of reposts everyday`,
              replies: [],
            },
          ],
        },
      ],
    },
  ];


  const [videoSrc, setVideoSrc] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/videos/media/call/${videoId}`);

        console.log(response.data.dirname);
        setVideoSrc(response.data.hls_file); // Assuming response.data.videoUrl contains the HLS URL (.m3u8)
        setTitle(response.data.name); // Assuming response.data.videoUrl contains the HLS URL (.m3u8)
      } catch (e) {
        console.log(e);
        setError(error);
      }
    };

    fetchVideo();
  }, []);


  return (
    <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly'
      }}

    >
      <div
        style={{width: '100%'}}
      >
        <VideoIntroduction
          videoId={videoId}
          // url={api_data[5].url}
          url={videoSrc}

          />
        <h2>{title}</h2>
        <p>Comments</p>
        {comments.map((comment) => (
          <CommentV4 key={comment.id} comment={comment} />
        ))}

        {/*<App/>*/}
        {/*<RedditApp/>*/}
      </div>

      <VideoWrapper
        style={{width: '490px'}}
      >
        {api_dataV2.map((item, index) =>
            // <StyledVideoCard
            // <VideoCard
            // <VideoPlayer
            // <CustomPlayer
            // <CustomPlayerV2
            // <CustomPlayerV3
            // <CustomPlayerV4
            <RecommendedVideo
            // <CustomBardPlayer
            // <VideoPlayerV2
              url={item.url}
              key={index}
              // light={item.url}
              light={item.thumbNail}
              viewsCount={item.viewsCount}
              likesCount={item.likesCount}
            />
          )
        }
      </VideoWrapper>

      {/*<Section>*/}

      {/*</Section>*/}
    </div>

    </>
  );


}

const VideoWrapper = styled.div`

  /* display: flex; */
  padding-left: 1em;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(3, 152px);
  /* grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); */
`;

export default VideoProfile;
