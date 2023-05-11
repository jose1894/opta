public function actionLoadDynaTree(){    	

$sql = "SELECT 
				  padre.area_des padre,
				  a.area_index,
				  a.indice,
				  a.area_des,
				  a.area_status,
				  a.area_padre,
				  a.ruta,
				  a.visible  visible,
				  a.editable editable
				FROM
				  db_areas a
				  LEFT OUTER JOIN db_areas padre ON (a.area_padre = padre.area_index)
				WHERE a.area_padre = 1 and a.visible = 1";		 
 
 //$sql = str_replace("--",$sqlwhere,$sql);
//$sql = $sql." ".$sqlOrder;
$dataProvider=new CSqlDataProvider($sql,array());		
$rows=$dataProvider->getData();        
$data = array();
$data['title']="Enfoque de Auditoría";
$data['expand']=true; 
$data['isFolder']=true;        
foreach ($rows as $item) {

	$data['children'][] = array('key'=>$item['area_index'],'title'=>$item['indice']." ".$item['area_des'],'isFolder'=>true,'children'=>$this->cargaHijos($item['area_index']));            
}        
 
echo CJSON::encode($data);
}



public function cargaHijos($id=null){

if($id==null){
  $sqlwhere="a.area_padre = 1";
}else{
 $sqlwhere = "a.area_padre = ".$id."";
}

$sql = "SELECT 
				   padre.area_des padre,
				   a.area_index,
				   a.indice,
				   a.area_des,
				   a.area_status,
				   a.area_padre,
				   a.ruta,
				   a.plantilla,
				   a.visible  visible,
				   a.editable editable
				 FROM
				   db_areas a
				   LEFT OUTER JOIN db_areas padre ON (a.area_padre = padre.area_index)
				 WHERE --";		 
  
  $sql = str_replace("--",$sqlwhere,$sql);
 //$sql = $sql." ".$sqlOrder;
 $dataProvider=new CSqlDataProvider($sql,array());		
 $rows=$dataProvider->getData();     
 $data = array();           
 foreach ($rows as $item) {
	 if (count($this->cargaHijos($item['area_index']))>0){
		 $data[] = array('key'=>$item['area_index'],'title'=>$item['indice']." ".$item['area_des'],'isFolder'=>true,'children'=>$this->cargaHijos($item['area_index']));            
	 }else{
		 $data[] = array('key'=>$item['area_index'],'title'=>$item['indice']." ".$item['area_des'],'href'=>Yii::app()->createUrl("dbAreasHijo/view",array('id'=>$item['area_index'])));
	 }
 }        
  
 return $data;
}



public function actionCreate()
	{
		$model=new DbAreasHijo;

		if(isset($_GET['asDialog'])){
			$this->layout="//layouts/main.bak.yii-1";
		}

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);
		//print_r($_POST['DbAreasHijo']);exit;
		if(isset($_POST['DbAreasHijo']))
		{
			$model->attributes=$_POST['DbAreasHijo'];
			$model->ruta = $model->Padre->ruta.'/'.$model->indice;
			$check = $_POST['DbAreasHijo']['checkinfo'];
			
			if ($check){
				$model->plantilla=CUploadedFile::getInstance($model,'plantilla');
				//print_r($model->plantilla);exit;
				if(!empty($model->plantilla)){
					Yii::import('application.controllers.DbAreasController');
					$ext = $model->plantilla->getExtensionName();
					$nombre = DbAreasController::sanear_string($model->plantilla->getName());
					$nombre = str_replace("_".$ext,".".$ext,$nombre);			
				}
			}
			if($model->save()){				
				if ($check){
					if(!empty($model->plantilla)){
						if (!file_exists(realpath(Yii::getPathOfAlias('webroot').'/archivos/Areas/'.$model->ruta))){
							mkdir(Yii::getPathOfAlias('webroot').'/archivos/Areas/'.$model->ruta,0777,true);
						}else{					
							array_map('unlink', glob(realpath(Yii::getPathOfAlias('webroot').'/archivos/Areas/'.$model->ruta).'/*'));	
						}
						
						if (!empty($model->plantilla)){
							$model->plantilla->saveAs(realpath(Yii::getPathOfAlias('webroot').'/archivos/Areas/'.$model->ruta).'/'.$nombre);
						}
						$model->plantilla = $nombre;
						$model->save();
					}
				}
				//Guarda el evento en la tabla bitacora
				$event['modulo'] = "Sub-Enfoques";
				$event['accion'] = "Crear";
				$event['descripcion'] = "Creación de sub-enfoque ".$model->indice." ".$model->area_des;				
				Controller::newEvent($event);	
				$this->redirect(array('view','id'=>$model->area_index));
			}
		}

		if(!isset($_GET['area_padre'])){
			$this->render('create',array(
				'model'=>$model,
			));
		}else{
			$this->render('create',array(
				'model'=>$model,'area_padre'=>$_GET['area_padre']
			));
		}
	}