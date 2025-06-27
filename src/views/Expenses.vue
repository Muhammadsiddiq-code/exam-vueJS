<template>
    <div class="chiqim">
     <div class="chiqim_top">
       <h1>Chiqimlar</h1>
       <button>Chiqim yaratish</button>
     </div>
       <div class="chiqim_blog">
         <header>
           <b>№</b>
           <b>Nomi</b>
           <b>Soni</b>
           <b>Narxi</b>
           <b>Tavsif</b>
           <b>Kimdan</b>
           <b></b>
         </header>
       </div>
   </div>
 </template>
 
 
 
 <script>
 export default {
   name: "Chiqim"
 }
 </script>
 
 
 
 <style>
    .chiqim{
 
   width: 88%;
 }
 .chiqim_blog{
   border: 1px solid rgb(200, 200, 200);
   height: 85vh;
   border-radius: 20px;
   padding: 20px;
 }
 .chiqim_top{
   display: flex;
   height: 70px;
   justify-content: space-between;
   align-items: center;
   
 }
 .chiqim_top h1{
     font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
 }
 .chiqim_top button{
   width: 250px;
   height: 40px;
     background-color: #5565ff;
     border: none;
     border-radius: 10px;
     font-family: Verdana, Geneva, Tahoma, sans-serif;
 font-size: 18px;
 color: #fff;
 }
 .chiqim_blog header{
   display: flex;
   justify-content: space-between;
   background-color: #ddd;
   padding: 20px;
   border-radius: 10px;
 
 }
 header b{
   width: 250px;
 }
 </style>