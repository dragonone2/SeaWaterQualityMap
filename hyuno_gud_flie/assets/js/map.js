var API_KEY_REAL = 'u089zc59om93nl8mv6822k695i6owncpm24g705';
var API_DOMAIN_REAL = 'swq-real-eoblb.run.goorm.site';
var baseMapLayerMap = null;

function selectBaseMap() {
    var opt = document.getElementById("selectBaseMap");
    var optVal = opt.options[opt.selectedIndex].value;

    var layer = layers[optVal];
    
    if (layer) {
          //layer.setOpacity(1);        //불투명도
          updateRenderEdgesOnLayer(layer);
          map.getLayers().setAt(0, layer);
      }    
    
  }
  //배경지도 변경
  var updateRenderEdgesOnLayer = function(layer) {
      if (layer instanceof ol.layer.Tile) {
          var source = layer.getSource();
      }
  };
  
  //해구도 그리드 선택(OPEN-API)
  function selectWms_change() {

      var opt = document.getElementById("select_wms");
      var optVal = opt.options[opt.selectedIndex].value;
      
      if(baseMapLayerMap != null){
          map.removeLayer(baseMapLayerMap.get("selectBox"));
      }
      var API_KEY = API_KEY_REAL
      var API_DOMAIN = API_DOMAIN_REAL
      if(API_KEY == null || API_KEY ==""){
          alert("API_KEY를 입력해주세요");
          return;
      }
      if(API_DOMAIN == null || API_KEY ==""){
          alert("API_DOMAIN을 입력해주세요");
          return;
      }
          
      
      var this_val = optVal;
      var this_title = "test";
      
      
        map.getLayers().forEach(function(layer){
            if(layer.get("name")=="wms_theme"){
                   map.removeLayer(layer);//기존결과 삭제        
           } 
          
       }) 
      var wms_tile = new ol.layer.Tile({
          title: this_title,
          name : "wms_theme",
          id: this_val,
          source : new ol.source.TileWMS({
              url : "https://gicoms.go.kr/kodispub/openApi/wms.do?",
              params : {
                  LAYERS : this_val.toLowerCase(),    //해구도레이어명(소문자)
                  STYLES : this_val.toLowerCase(),    //해구도레이어스타일(소문자)
                  CRS : "EPSG:3857",                    //좌표
                  apikey : API_KEY ,                     //사용자 API-KEY 정보
                  domain : API_DOMAIN ,                //사용자 도메인정보
                  bbox : "13803616.8583659,3697855.3303377,14471533.8031256,4579425.8128701",
                  title : this_title,                    //타이틀
                  FORMAT : "image/png",
                  VERSION : "1.1.0"
                  
              }
          })
      });

      map.addLayer(wms_tile);            //해구도레이어 표출
      
      
  }

  //OPEN-API 현시점 AIS통계정보     
  function showAis(){
  
  if(baseMapLayerMap != null){
          map.removeLayer(baseMapLayerMap.get("selectBox"));
      }
      var API_KEY = API_KEY_REAL;
      var API_DOMAIN = API_DOMAIN_REAL;
      var select_wms = $('#select_wms').val();
      var ID = "";
      if(select_wms == "lage_trench_sarea_m" ){
           ID= "lage_trench_sarea_m_view";
      }else if(select_wms == "mwg_trench_sarea_m"){
           ID= "small_trench_sarea_m_view";
      }else if(select_wms == "mwg_msp_grid_v2_m"){
           ID= "msp_trench_sarea_m_view";
      }
      
      if(select_wms == null || select_wms =="선택"){
          alert("해구도를 선택해주세요");
          return;
      }
      
      if(API_KEY == null || API_KEY ==""){
          alert("API_KEY를 입력해주세요");
          return;
      }
      if(API_DOMAIN == null || API_KEY ==""){
          alert("API_DOMAIN을 입력해주세요");
          return;
      }
          
      
      var this_val = API_KEY ; 
      var this_title = "test";
      //var wms_val =  $(this).val();
      
      
        map.getLayers().forEach(function(layer){
            if(layer.get("name")=="wms_theme"){
                   map.removeLayer(layer);//기존결과 삭제        
           } 
          
       }) 
      
      
      
      var wms_tile = new ol.layer.Tile({
          title: this_title,
          name : "wms_theme",
          id: ID,
          source : new ol.source.TileWMS({
              url : "https://gicoms.go.kr/kodispub/openApi/wms.do?",
              params : {
                  LAYERS : ID.toLowerCase(),
                  STYLES : ID.toLowerCase(),
                  CRS : "EPSG:3857",
                  apikey : API_KEY , 
                  bbox : "13803616.8583659,3697855.3303377,14471533.8031256,4579425.8128701",
                  title : this_title,
                  FORMAT : "image/png",
                  domain : API_DOMAIN ,
                  VERSION : "1.1.0"
                  
              }
          })
      });
      
      if(baseMapLayerMap == null){
          baseMapLayerMap = new HashMap();
      }
      
      map.addLayer(wms_tile);
      
      map.getLayers().forEach(function(layer){
       
       var layer = layer.get("id");
      
      });
      
      baseMapLayerMap.put(ID.toLowerCase() , wms_tile);    //초기화
}

function HashMap (){
  var key_list = new Array();
  var val_list = new Array();
  
  var hashMap = {
      put : function( key , value){
          this.dupCheck( key );
          key_list.push(key);
          val_list.push(value);
      },
      
      get : function( key ){
          var idx = this.getIndex(key);
          if( idx > -1 ){
              return val_list[idx];
          }
          return null;
      },
      
      getIndex : function( key ){
          for( var i=0 ; i<key_list.length ; i++){
              if( key == key_list[i]){
                  return i;
              }
          }
          return -1;
      },
      
      size : function(){
          return key_list.length;
      }, 
      
      dupCheck : function( key){
          var idx = this.getIndex(key);
          if( idx > -1){
              var tmp_key_list = new Array();
              var tmp_val_list = new Array();
              for( var i=0 ; i<key_list.length ; i++){
                  if( i != idx ){
                      tmp_key_list.push(key_list[i]);
                      tmp_val_list.push(val_list[i]);
                  }
              }
              key_list = tmp_key_list;
              val_list = tmp_val_list;
          }
      },
      
      remove : function( key ){
          this.dupCheck(key);
      }, 
      
      getKeyList : function(){
          return key_list;
      }
  };
  return hashMap;
  
}
  


  
// 해구도 정보 가져오기
function clickFeatureInfo(url, clickFeatureInfo){
  
   var layerName = clickFeatureInfo;
   
  // 구역별 AIS 통계
  if(layerName == "lage_trench_sarea_m_view" || layerName == "small_trench_sarea_m_view" || layerName == "msp_trench_sarea_m_view" ){
      if (url) {
          $.ajax({
              url : url , 
              type : "GET" , 
              dataType : "json" , 
              success : function(result){
                  
                  if(result.features.length > 0){
                      var selectNm = result.features[0].properties.map_nm;
                      var regDtTemp = result.features[0].properties.reg_dt;
                      var cnt = result.features[0].properties.cnt;
                      //alert(selectNm)        //맵이름
                      //alert(regDtTemp)    //날짜
                      //alert(cnt)            //AIS정보
                      $('#wms_result').html("맵이름(map_nm):: " + selectNm +"   날짜(reg_dt):: " +regDtTemp + "   AIS 선박수(cnt):: " + cnt  );
                      makeSelectBox(result, layerName);
                  }
              } , 
              error : function( xhr , textStatus , errorThrown){
                  alert("서버로부터 데이터를 받아오지 못했습니다.");
              }, 
              
          });
      }
  }
  
}    
// 클릭한구역 색칠해주기
  function makeSelectBox(result, layerName){
      
      var layerName = layerName;
      //alert("색칠한구역" + baseMapLayerMap.get("selectBox"))
      if(baseMapLayerMap.get("selectBox") != null){
          
          map.removeLayer(baseMapLayerMap.get("selectBox"));
          baseMapLayerMap.remove("selectBox");
      }
      var extent = result.features[0].geometry.coordinates[0][0]
      //console.log(extent)
      
      var polyFeature = new ol.Feature({
           geometry: new ol.geom.Polygon([
               [
                    extent[0],extent[1],extent[2],extent[3],extent[4]
               ]

           ])
       });
      
      
      var styles = new ol.style.Style({
          stroke: new ol.style.Stroke({
              color: 'red',
              width: 2,
              lineDash:[2, 5]
            })
            
      })
      


      var source = new ol.source.Vector({
          features: [
                             polyFeature
                     ]
      });

       var vectorLayer = new ol.layer.Vector({
           source: source
           ,style : styles
       });
       
      map.addLayer(vectorLayer);
      baseMapLayerMap.put( "selectBox" , vectorLayer);        //초기화
  }
  var baseMapLayerMap = null;
    
    var layers = {};
    
    // OSM 배경지도
    layers['osm'] = new ol.layer.Tile({
        title : 'OSM Map',
        visible : true,
        type : 'base',
        source: new ol.source.OSM()
    });
    
    // vectorSource 선언
    var vectorSource = new ol.source.Vector({
        projection: 'EPSG:4326'
    });
    
    // vectorLayer 선언
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    
    // target에 배경지도 기본맵 선언
    var map = new ol.Map({
       target: 'map',
       layers : [ layers['osm'], vectorLayer ],        //기본맵 세팅(OSM)
       view: new ol.View({
           center:ol.proj.transform([127, 36], 'EPSG:4326', 'EPSG:3857'),
           zoom: 7,
           minZoom: 5,
           maxZoom: 15
       })
    });
    
    
    // 지도클릭 이벤트
    map.on('click', function (evt) {
        var pixel = evt.pixel;    
        map.getLayers().forEach(function(layer){
            if(layer.get("name")=="wms_theme"){ 
                var clickLayer = layer.get("id");
                var clickLayer1 = baseMapLayerMap.get(clickLayer);
                var url = clickLayer1.getSource().getGetFeatureInfoUrl(
                     evt.coordinate, map.getView().getResolution(), 'EPSG:3857',
                        { 'INFO_FORMAT': 'application/json' }
                );
                
                clickFeatureInfo(url, clickLayer); 
            }
            
          });
    });    
