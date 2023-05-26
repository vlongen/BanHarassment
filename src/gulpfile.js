import gulp from 'gulp'
import debug from 'gulp-debug'
import merge from 'gulp-merge-json'
import jsoncombinearray from 'gulp-jsoncombine-array'
import fs from 'fs'
import path from 'path'
import del from 'del'
import zip from 'gulp-zip'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import concatFolders from 'gulp-concat-folders'

const generatorPhoneJSON = () => {
  return gulp.src('dataset/phone/*.json')
    .pipe(debug())
    .pipe(merge({
      fileName: 'phone-json.json',
      concatArrays: true,
      transform: (mergedJson) => {
        return {
          name:"防骚扰屏蔽-电话",
          data: [...mergedJson.data,]
        };
      },
    }))
    .pipe(gulp.dest('./dataset'))
}
const generatorSMSJSON = () => {
  return gulp.src('dataset/sms/*.json')
    .pipe(debug())
    .pipe(merge({
      fileName: 'sms-json.json',
      concatArrays: true,
      transform: (mergedJson) => {
        return {
          name:"防骚扰屏蔽-短信",
          data: [...mergedJson.data,]
        };
      },
    }))
    .pipe(gulp.dest('./dataset'))
}
const generatorPhoneArray = () => {
  return gulp.src('dataset/phone/*.json')
    .pipe(debug())
    .pipe(jsoncombinearray("phone-array.json",function(dataArray) {
      // do any work on data here
      let data = []
      dataArray.forEach((item, index)=>{
        data.push(...item.data)
      })
      return new Buffer(JSON.stringify(data));
    }))
    .pipe(gulp.dest('./dataset'))
}
const generatorSMSArray = () => {
  return gulp.src('dataset/sms/*.json')
    .pipe(debug())
    .pipe(jsoncombinearray("sms-array.json",function(dataArray) {
      // do any work on data here
      let data = []
      dataArray.forEach((item, index)=>{
        data.push(...item.data)
      })
      return new Buffer(JSON.stringify(data));
    }))
    .pipe(gulp.dest('./dataset'))
}
const generatorPhone = () => {
  return gulp.src('dataset/phone/*.json')
    .pipe(debug())
    .pipe(jsoncombinearray("phone.json",function(dataArray) {
      // do any work on data here
      let data = []
      dataArray.forEach((item, index)=>{
        item.data.forEach((itemData, indexData)=>{
          data.push(...Array.from(new Set([
            itemData['prefix']
          ])))
        })
      })
      data = Array.from(new Set(data))
      data = data.filter(item => item !== '');
      return new Buffer(JSON.stringify(data));
    }))
    .pipe(gulp.dest('./dist'))
}
const generatorSMS = () => {
  return gulp.src('dataset/sms/*.json')
    .pipe(debug())
    .pipe(jsoncombinearray("sms.json",function(dataArray) {
      // do any work on data here
      let data = []
      dataArray.forEach((item, index)=>{
        item.data.forEach((itemData, indexData)=>{
          data.push(...Array.from(new Set([
            itemData['signature'],
            itemData['binding'],
            itemData['register'],
            itemData['resetting'],
          ])))
        })
      })
      data = Array.from(new Set(data))
      data = data.filter(item => item !== '');
      return new Buffer(JSON.stringify(data));
    }))
    .pipe(gulp.dest('./dist'))
}

const build = gulp.series(
  generatorPhone,
  generatorPhoneJSON,
  generatorPhoneArray,
  generatorSMS,
  generatorSMSJSON,
  generatorSMSArray
)

export {
  generatorPhone,
  generatorPhoneJSON,
  generatorPhoneArray,
  generatorSMS,
  generatorSMSJSON,
  generatorSMSArray,
  build
}