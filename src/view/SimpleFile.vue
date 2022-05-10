<template>
  <div>
    <uploader :options="uploadOptions1" :autoStart="true" class="uploader-app">
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <uploader-btn style="margin-right: 20px" :attrs="attrs"
          >选择文件</uploader-btn
        >
        <uploader-btn :attrs="attrs" directory>选择文件夹</uploader-btn>
      </uploader-drop>
      <uploader-list></uploader-list>
    </uploader>
  </div>
</template>

<script>
export default {
  name: "SimpleFile",
  data() {
    return {
      uploadOptions1: {
        target: "/api/uploader/single", //上传的接口
        testChunks: false, //是否开启服务器分片校验
        fileParameterName: "upfile", //默认的文件参数名
        headers: {},
        query() {},
        categaryMap: {
          //用于限制上传的类型
          image: ["gif", "jpg", "jpeg", "png", "bmp"],
        },
      },
      attrs: {
          //用于限制上传的类型
          image: ["gif", "jpg", "jpeg", "png", "bmp"],
        },
    };
  },
};
</script>

<style>
</style>