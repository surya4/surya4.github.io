module.exports = function(grunt) {

    grunt.initConfig({
        // resize images from pizza
        responsive_images: {
                    main: {
                        options: {
                            engine: 'im',
                            sizes: [{
                                width: 100
                            }, {
                                width: 720
                            }]
                        },
                        files: [{
                            expand: true,
                            src: ['*.{gif,jpg,png,jpeg}'],
                            cwd: 'views/images/',
                            dest: 'views/images/grunt-image/'
                        }]
                    }
                }
    });

    grunt.loadNpmTasks('grunt-responsive-images');

    // Where we tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [
        'responsive_images'
    ]);
};
