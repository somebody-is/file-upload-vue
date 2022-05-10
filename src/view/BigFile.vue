<template>
  <div>
    <uploader
      :options="uploadOptions2"
      :autoStart="false"
      :file-status-text="fileStatusText"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-error="onFileError"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <uploader-btn :attrs="categaryMap">分块上传</uploader-btn>
      </uploader-drop>
      <uploader-list></uploader-list>
    </uploader>
  </div>
</template>

<script>
import { ACCEPT_CONFIG } from "@/common/config";
import SparkMD5 from "spark-md5";
import { mergeFile } from "@/api/index";
export default {
  name: "BigFile",
  data() {
    return {
      uploadOptions2: {
        target: "/api/uploader/uploadChunk",
        fileParameterName: "upfile",
        chunkSize: 10 * 1024 * 1024,
        testChunks: true,
        /* 
        服务器分片校验函数，判断秒传及断点续传,传入的参数是Uploader.Chunk实例以及请求响应信息
        reponse码是successStatuses码时，才会进入该方法
        reponse码如果返回的是permanentErrors 中的状态码，不会进入该方法，直接进入onFileError函数 ，并显示上传失败
        reponse码是其他状态码，不会进入该方法，正常走标准上传
        checkChunkUploadedByResponse函数直接return true的话，不再调用上传接口
        */
        checkChunkUploadedByResponse: function (chunk, message) {
          let objMessage = JSON.parse(message);
          if (objMessage.skipUpload) {
            return true;
          }
          // 获取当前的上传块的集合
          let chunkNumbers = objMessage.chunkNumbers;
          // 判断当前的块是否被该集合包含，从而判定是否需要跳过
          return (chunkNumbers || []).indexOf(chunk.offset + 1) >= 0;
        },
      },
      categaryMap: {
        accept: ACCEPT_CONFIG.getAll(),
      },
      fileStatusText: {
        success: "上传成功",
        error: "上传失败",
        uploading: "上传中",
        paused: "暂停中",
        waiting: "等待上传中..",
      },
    };
  },
  methods: {
    onFileAdded(file) {
      console.log(file);
      file.pause();
      this.fileStatusText.paused = "正在计算md5";
      const fileSizeLimit = 2 * 1024 * 1024 * 1024;
      if (file.size > fileSizeLimit) {
        this.$message({
          showClose: true,
          message: "文件大小不能超过2G",
        });
        file.cancel();
      }
      this.computeMD5(file);
    },
    computeMD5(file) {
      const sliceLength = 10;
      const chunkSize = Math.ceil(file.size / sliceLength);
      const fileReader = new FileReader();
      const md5 = new SparkMD5();
      let index = 0;
      const loadFile = () => {
        const slice = file.file.slice(index, index + chunkSize);
        fileReader.readAsBinaryString(slice);
      };
      loadFile();
      fileReader.onload = (e) => {
        md5.appendBinary(e.target.result);
        if (index < file.size) {
          index += chunkSize;
          loadFile();
        } else {
          let md5Result = md5.end();
          console.log(md5Result);
          file.uniqueIdentifier = md5Result;
          file.resume();
        }
      };
    },
    onFileSuccess(rootFile, file, response, chunk) {
      let res = JSON.parse(response);
      mergeFile(file)
        .then((responseData) => {
          if (responseData.code === 415) {
            console.log("合并操作未成功，结果码：" + responseData.data.code);
          }
        })
        .catch(function (error) {
          console.log("合并后捕获的未知异常：" + error);
        });
    },
    onFileError(rootFile, file, response, chunk) {
      console.log("上传完成后异常信息：" + response);
    },
  },
};
</script>

<style>
</style>