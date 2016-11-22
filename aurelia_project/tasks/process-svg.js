import gulp from 'gulp';
import project from '../aurelia.json';
import {build} from 'aurelia-cli';

export default function processSVG() {
  return gulp.src(project.svgProcessor.source)
    .pipe(build.bundle());
};
