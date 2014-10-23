//chrome.storage.local.clear();
(function(window, document) {
	var createGIFButton = document.querySelector('#create-gif'),
		gifSource = document.querySelector('#GIFSource'),
		gifType = document.querySelector('#GIFType'),
		interval = document.querySelector("#interval"),
		numFrames = document.querySelector("#numFrames"),
		gifHeight = document.querySelector("#gifHeight"),
		gifWidth = document.querySelector("#gifWidth"),
		progressBar = document.querySelector("progress"),
		text = document.querySelector('#gifText'),
		fontWeight = document.querySelector('#fontWeight'),
		fontSize = document.querySelector('#fontSize'),
		fontFamily = document.querySelector('#fontFamily'),
		fontColor = document.querySelector('#fontColor'),
		textAlign = document.querySelector('#textAlign'),
		textBaseline = document.querySelector('#textBaseline'),
		sampleInterval = document.querySelector('#sampleInterval'),
		numWorkers = document.querySelector('#numWorkers'),
		gifshotImagePreview = document.querySelector('.gifshot-image-preview-section'),
		placeholderDiv = document.querySelector('.placeholder-div'),
		placeholderDivDimensions = document.querySelector('.placeholder-div-dimensions'),
		gifshotCode = document.querySelector('.gifshot-code'),
		gifshotCodeTemplate = document.querySelector('.gifshot-code-template'),
		videoUploadForm = document.querySelector('#videoUploadForm'),
		videoUrl = document.querySelector('#videoUrl'),
		videoUpload = document.querySelector('#videoUpload'),
		videoWebCam = document.querySelector('#videoWebCam'),
		videoPreview = document.querySelector('#videoPreview'),
		reset = document.querySelector('#reset'),
		getSelectedOptions = function() {
			
			var video;
			if(videoUpload.value != '') {
				video = [videoUpload.value];
				alert('Sorry, this does not work yet :(');
				video = ['example.mp4', 'example.ogv'];
			} else {
				video = [videoUrl.value];
			}
			
			return {
				'gifWidth': +gifWidth.value,
				'gifHeight': +gifHeight.value,
				'images': gifSource.value === 'images' ? ['http://i.imgur.com/2OO33vX.jpg', 'http://i.imgur.com/qOwVaSN.png', 'http://i.imgur.com/Vo5mFZJ.gif'] : false,
				'video': gifSource.value === 'video' ? video : false,
				'interval': +interval.value,
				'numFrames': +numFrames.value,
				'text': text.value,
				'fontWeight': fontWeight.value,
				'fontSize': fontSize.value + 'px',
				'fontFamily': fontFamily.value,
				'fontColor': fontColor.value,
				'textAlign': textAlign.value,
				'textBaseline': textBaseline.value,
				'sampleInterval': +sampleInterval.value,
				'numWorkers': +numWorkers.value
			}
		},
		passedOptions,
		bindEvents = function() {
			createGIFButton.addEventListener('click', function(e) {
				passedOptions = _.merge(_.clone(getSelectedOptions()), {
					'progressCallback': function(captureProgress) {
						gifshotImagePreview.innerHTML = '';
						placeholderDiv.classList.add('hidden');
						progressBar.classList.remove('hidden');
						progressBar.value = captureProgress;
					}
				});

				var method = gifType.value === 'snapshot' ? 'takeSnapShot' : 'createGIF';
				console.log(passedOptions);
				
				gifshot[method](passedOptions, function(obj) {
					if (!obj.error) {
						var image = obj.image,
							animatedImage = document.createElement('img');
						animatedImage.src = image;

						progressBar.classList.add('hidden');
						progressBar.value = 0;

						placeholderDiv.classList.add('hidden');
						gifshotImagePreview.innerHTML = '';
						gifshotImagePreview.appendChild(animatedImage);
					} else {
						console.log('obj.error', obj.error);
						console.log('obj.errorCode', obj.errorCode);
						console.log('obj.errorMsg', obj.errorMsg);
					}
				});
			}, false);

			//Preview video
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
			 
			if (navigator.getUserMedia) {       
				navigator.getUserMedia({video: true}, handleVideo, videoError);
			}
			 
			function handleVideo(stream) {
				videoWebCam.src = window.URL.createObjectURL(stream);
				
				var handler = gifSource.addEventListener('change', function(event) {
					stream.stop();
					//videoWebCam.style.display = 'none';
					window.removeEventListener('change', handler, false );
				});
			}
			 
			function videoError(e) {
				// do something
				alert('error with video stream');
			}
			
			videoUploadForm.style.display = 'none';
			
			gifSource.addEventListener('change', function(e) {
					videoWebCam.style.display = 'none';
					videoUploadForm.style.display = 'none';
					switch(e.target.value)
					{
						case 'webcam':
							if (navigator.getUserMedia) {
								videoWebCam.style.display = '';
								navigator.getUserMedia({video: true}, handleVideo, videoError);
							}
							break;
						case 'video':
							videoUploadForm.style.display = '';
							break;
						case 'images':
							
							break;
					}
					console.log('showing video');
			});
			
			//allow the image to be downloaded:
			gifshotImagePreview.onclick = function() {
				var img = gifshotImagePreview.getElementsByTagName('img');
				if(img.length)
				{
					img = img[0];
					console.log(img);
					
					// atob to base64_decode the data-URI
					var image_data = atob(img.src.split(',')[1]);
					// Use typed arrays to convert the binary data to a Blob
					var arraybuffer = new ArrayBuffer(image_data.length);
					var view = new Uint8Array(arraybuffer);
					for (var i=0; i<image_data.length; i++) {
						view[i] = image_data.charCodeAt(i) & 0xff;
					}
					try {
						// This is the recommended method:
						var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
					} catch (e) {
						var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
						bb.append(arraybuffer);
						var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
					}
					
					saveAs(blob, 'gifshot.gif');
				}
			};
			
			//adjust camera width/height to mimic output
			gifHeight_watcher = function(value) {
				if(gifSource.value == 'webcam' ) {
					videoWebCam.height 
						= videoPreview.height
						= value;
					
				}
			};
			way.watch('gifshot_form.gifHeight', gifHeight_watcher);
			
			gifWidth_watcher = function(value) {
				if(gifSource.value == 'webcam' ) {
					videoWebCam.width
						= videoPreview.width
						= value;
				}
			};
			way.watch('gifshot_form.gifWidth', gifWidth_watcher);
			
			//hack to default this in on first load
			setTimeout(function() {
				var height = way.get('gifshot_form.gifHeight');
				console.log(way.get('gifshot_form.gifHeight'));
				if(height == undefined) {
					height = 200;
				}
				videoWebCam.height = height;
				var width = way.get('gifshot_form.gifWidth');
				if(width == undefined) {
					width = 200;
				}
				videoWebCam.width = width;
				
			}, 1000);
			
			videoUrl.addEventListener('change', function() { 
				videoPreview.src = videoUrl.value;
			});
			
			videoUpload.addEventListener('change', function() { 
				console.log(videoUpload.value);
			});
			
			var reset_all_the_things = function(event) {
				//Nuclear options
				chrome.storage.local.clear();
				//way.clear();
				
				way.setDefaults(true);
				videoWebCam.height = 200;
				videoWebCam.width = 200;
				return false;
			};
			
			reset.onclick = reset_all_the_things
			
			chrome.storage.local.get('init', function(data) {
				console.log('init', data);
				if(data === undefined) {
					chrome.storage.local.set({init:true});
					way.setDefaults(true);
					videoWebCam.height = 200;
					videoWebCam.width = 200;
				}
			});
			
		};
		
		bindEvents();

}(window, document));
