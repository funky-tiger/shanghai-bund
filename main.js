/** 贴图加载器 */
const loader = new THREE.TextureLoader();

/** 材质颜色常量 */
const MATERIAL_COLOR = "rgb(120, 120, 120)";

/** 调整阴影的锯齿 默认值512  数值是1024的整数倍 数值越大 锯齿感越小 要求的显卡性能越高  */
const SHADOW_MAPSIZE = 3072;

/** 上海中心大厦坐标位置 */
const shanghaiTowerPosition = { x: 25, y: 17, z: -30 };

/** 环球金融中心坐标位置 */
const globalFinancialCenterPosition = { x: 15, y: 0, z: -30 };

/** 金茂大厦坐标位置 */
const jinmaoTowerPosition = { x: 18, y: 11, z: -20 };

/** 其他随机建筑物的坐标位置数组 */
const randomBuildingPositionsArr = [
  { x: -13, y: 0, z: -15 },
  { x: -7, y: 0, z: -13 },
  { x: -1, y: 0, z: -16 },
  { x: -2, y: 0, z: -10 },
  { x: -8, y: 0, z: -5 },
  { x: 5, y: 0, z: -25 },
  { x: -3, y: 0, z: -18 },
  { x: -8, y: 0, z: -18 },
  { x: -18, y: 0, z: -25 },
  { x: -6, y: 0, z: -25 },
  { x: -3, y: 0, z: -30 },
  { x: -10, y: 0, z: -30 },
  { x: -17, y: 0, z: -30 },
  { x: -3, y: 0, z: -35 },
  { x: -12, y: 0, z: -35 },
  { x: -20, y: 0, z: -35 },
  { x: -3, y: 0, z: -40 },
  { x: -16, y: 0, z: -40 },
  { x: 16, y: 0, z: -40 },
  { x: 18, y: 0, z: -38 },
  { x: 16, y: 0, z: -40 },
  { x: 30, y: 0, z: -40 },
  { x: 32, y: 0, z: -40 },
  { x: 16, y: 0, z: -35 },
  { x: 36, y: 0, z: -38 },
  { x: 42, y: 0, z: -32 },
  { x: 42, y: 0, z: -26 },
  { x: 35, y: 0, z: -20 },
  { x: 36, y: 0, z: -32 },
  { x: 25, y: 0, z: -22 },
  { x: 26, y: 0, z: -20 },
  { x: 19, y: 0, z: -8 },
  { x: 30, y: 0, z: -18 },
  { x: 25, y: 0, z: -15 },
  { x: 9, y: 0, z: -10 },
  { x: 1, y: 0, z: -9 },
  { x: 1, y: 0, z: -30 },
  { x: 0, y: 0, z: -35 },
  { x: 1, y: 0, z: -32 },
  { x: 8, y: 0, z: -5 },
  { x: 15, y: 0, z: -6 },
  { x: 5, y: 0, z: -40 },
  { x: 9, y: 0, z: -40 }
];

/** 其他随机建筑物的贴图路径数组 */
const randomBuildingTexturesArr = [
  "./assets/textures/building1.jpg",
  "./assets/textures/building2.jpg",
  "./assets/textures/building3.jpg",
  "./assets/textures/building4.jpg",
  "./assets/textures/building5.jpg",
  "./assets/textures/building6.jpg",
  "./assets/textures/building7.jpg",
  "./assets/textures/building8.jpg",
  "./assets/textures/building9.jpg",
  "./assets/textures/building10.jpg"
];

/** 初始化项目 */
init();

function init() {
  // 场景
  let scene = new THREE.Scene();
  // 性能监控
  let stats = new Stats();
  document.body.appendChild(stats.dom);

  let clock = new THREE.Clock();
  let gui = new dat.GUI();
  // 坐标轴辅助器
  let axesHelper = new THREE.AxesHelper(500);
  // 网格辅助器
  let gridHelper = new THREE.GridHelper(100, 100);
  // scene.add(axesHelper);
  // scene.add(gridHelper);

  // 地面1
  let ground1 = getGroundFront();

  // 地面2
  let ground2 = getGroundBehind();

  // 东方明珠
  let orientalPearl = getOrientalPearl();

  // 上海中心大厦
  let shanghaiTower = getShanghaiTower(
    shanghaiTowerPosition.x,
    shanghaiTowerPosition.y,
    shanghaiTowerPosition.z
  );

  // 环球金融中心
  let globalFinancialCenter = getShangHaiGlobalFinancialCenter(
    globalFinancialCenterPosition.x,
    globalFinancialCenterPosition.y,
    globalFinancialCenterPosition.z
  );

  // 金茂大厦
  let jinmaoTower = getJinmaoTower(
    jinmaoTowerPosition.x,
    jinmaoTowerPosition.y,
    jinmaoTowerPosition.z
  );

  // 随机建筑物
  getBuilding(scene, randomBuildingPositionsArr);

  // 黄浦江
  let river = getRiver();
  river.name = "river";

  scene.add(ground1);
  scene.add(ground2);
  scene.add(orientalPearl);
  scene.add(shanghaiTower);
  scene.add(globalFinancialCenter);
  scene.add(jinmaoTower);
  scene.add(river);

  // 全景视图
  scene.background = getReflectionCube();

  // 光源
  let spotLight = getSpotLight(1.2);
  spotLight.position.set(100, 100, 80);
  scene.add(spotLight);

  // 相机
  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 30, 90);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // 3.渲染器
  let renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(MATERIAL_COLOR);
  renderer.shadowMap.enabled = true; // 开启渲染器的阴影功能
  renderer.shadowMap.type = THREE.PCFShadowMap; // PCF阴影类型
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById("webgl").appendChild(renderer.domElement);

  // 相机轨道控制器
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls, stats, clock);
}

function getReflectionCube() {
  // 360全景视图
  let path = "./assets/cubemap/";
  let format = ".jpg";
  let urls = [
    `${path}px${format}`,
    `${path}nx${format}`,
    `${path}py${format}`,
    `${path}ny${format}`,
    `${path}pz${format}`,
    `${path}nz${format}`
  ];
  let reflectionCube = new THREE.CubeTextureLoader().load(urls);
  reflectionCube.format = THREE.RGBFormat;
  return reflectionCube;
}

// 其他随机建筑
function getBuilding(scene, positionsArr) {
  let defauleLength = 16;
  // w, h, d
  for (let i = 0; i < positionsArr.length; i++) {
    let w = Math.random() * 3 + 2; // 随机数(2, 5);
    let d = Math.random() * 3 + 2; // 随机数(2, 5);
    let _h = Math.random() * defauleLength + 2;
    let h = _h < 3 ? _h + 3 : _h; // 随机数(0, 15.5);
    let geometry = new THREE.BoxGeometry(w, h, d);
    let material = new THREE.MeshPhongMaterial({ color: MATERIAL_COLOR });
    // 贴图随机数下标 textureInd   范围[0, 9]
    let textureInd = Math.floor(Math.random() * 10);
    let texture = THREE.ImageUtils.loadTexture(
      randomBuildingTexturesArr[textureInd]
    );
    // 设置贴图的矩阵重复方式
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    // 设置行列的重复次数
    texture.repeat.set(1, h / 2);
    // 为几何体的每个面进行单独贴图
    let caizhi = [
      new THREE.MeshPhongMaterial({ map: texture }),
      new THREE.MeshPhongMaterial({ map: texture }),
      new THREE.MeshPhongMaterial({ map: texture }),
      material, //底部
      new THREE.MeshPhongMaterial({ map: texture }),
      new THREE.MeshPhongMaterial({ map: texture })
    ];
    let mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(caizhi));
    mesh.position.set(
      positionsArr[i].x,
      positionsArr[i].y + h / 2,
      positionsArr[i].z
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
}

// 金茂大厦
function getJinmaoTower(x, y, z) {
  let JinmaoTower = new THREE.Object3D();
  let _geometry = new THREE.BoxGeometry(1, 22, 6);
  let _material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });

  _material.map = loader.load("./assets/textures/building5.jpg"); // 颜色贴图
  _material.map.wrapS = THREE.RepeatWrapping; // 水平方向重复贴图 为了保证贴图的质量
  _material.map.wrapT = THREE.RepeatWrapping; // 竖直方向重复贴图
  _material.map.repeat.set(0.35, 8);

  // 金茂大厦中间骨架
  var cube1 = new THREE.Mesh(_geometry, _material);
  var cube2 = new THREE.Mesh(_geometry, _material);
  cube2.rotation.set(0, Math.PI / 2, 0);

  // 金茂大厦主干
  let towerBody = getJinmaoTowerBody();
  // 金茂大厦顶部主体
  let towerTop = getJinmaoTowerTop();

  JinmaoTower.add(cube1);
  JinmaoTower.add(cube2);
  JinmaoTower.add(towerBody);
  JinmaoTower.add(towerTop);
  JinmaoTower.receiveShadow = true;
  JinmaoTower.position.set(x, y, z);
  return JinmaoTower;
}

// 金茂大厦顶部主体
function getJinmaoTowerTop() {
  let towerTop = new THREE.Object3D();
  let _geometry1 = new THREE.BoxGeometry(3.8, 0.5, 3.8);
  let _geometry2 = new THREE.BoxGeometry(3, 0.5, 3);
  let _geometry3 = new THREE.BoxGeometry(2.2, 0.5, 2.2);
  let _geometry4 = new THREE.BoxGeometry(1.4, 0.5, 1.4);
  let _cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.5, 5, 3);

  let _material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });

  // 纹理贴图
  _material.map = loader.load("./assets/textures/JMtowertop.jpg"); // 颜色贴图
  _material.map.wrapS = THREE.RepeatWrapping; // 水平方向重复贴图 为了保证贴图的质量
  _material.map.wrapT = THREE.RepeatWrapping; // 竖直方向重复贴图
  _material.map.repeat.set(0.35, 1);

  let cube1 = new THREE.Mesh(_geometry1, _material);
  let cube2 = new THREE.Mesh(_geometry2, _material);
  let cube3 = new THREE.Mesh(_geometry3, _material);
  let cube4 = new THREE.Mesh(_geometry4, _material);
  let cylinder = new THREE.Mesh(_cylinderGeometry, _material);

  cube2.position.set(0, 0.5, 0);
  cube3.position.set(0, 1, 0);
  cube4.position.set(0, 1.5, 0);
  cylinder.position.set(0, 2, 0);

  towerTop.add(cube1);
  towerTop.add(cube2);
  towerTop.add(cube3);
  towerTop.add(cube4);
  towerTop.add(cylinder);
  towerTop.position.set(0, 11, 0);
  towerTop.rotation.set(0, Math.PI / 4, 0);
  return towerTop;
}

// 金茂大厦身体主干
function getJinmaoTowerBody() {
  let towerBody = new THREE.Object3D();
  let _geometry1 = new THREE.BoxGeometry(5, 7, 5);
  let _geometry2 = new THREE.BoxGeometry(4.5, 5.5, 4.5);
  let _geometry3 = new THREE.BoxGeometry(4, 4, 4);
  let _geometry4 = new THREE.BoxGeometry(3.5, 3, 3.5);
  let _geometry5 = new THREE.BoxGeometry(3, 2, 3);
  let _geometry6 = new THREE.BoxGeometry(2.5, 1.5, 2.5);
  let _geometry7 = new THREE.BoxGeometry(2, 1.3, 2);
  let _geometry8 = new THREE.BoxGeometry(1.5, 1, 1.5);
  let _material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });

  // 贴图纹理
  _material.map = loader.load("./assets/textures/JMtowerbody.jpg"); // 颜色贴图
  _material.map.wrapS = THREE.RepeatWrapping; // 水平方向重复贴图 为了保证贴图的质量
  _material.map.wrapT = THREE.RepeatWrapping; // 竖直方向重复贴图
  _material.map.repeat.set(0.5, 1);

  let cube1 = new THREE.Mesh(_geometry1, _material);
  let cube2 = new THREE.Mesh(_geometry2, _material);
  let cube3 = new THREE.Mesh(_geometry3, _material);
  let cube4 = new THREE.Mesh(_geometry4, _material);
  let cube5 = new THREE.Mesh(_geometry5, _material);
  let cube6 = new THREE.Mesh(_geometry6, _material);
  let cube7 = new THREE.Mesh(_geometry7, _material);
  let cube8 = new THREE.Mesh(_geometry8, _material);
  cube2.position.set(0, 5.5, 0);
  cube3.position.set(0, 9.5, 0);
  cube4.position.set(0, 12.5, 0);
  cube5.position.set(0, 14.5, 0);
  cube6.position.set(0, 16, 0);
  cube7.position.set(0, 17.3, 0);
  cube8.position.set(0, 18.3, 0);

  towerBody.add(cube1);
  towerBody.add(cube2);
  towerBody.add(cube3);
  towerBody.add(cube4);
  towerBody.add(cube5);
  towerBody.add(cube6);
  towerBody.add(cube7);
  towerBody.add(cube8);
  towerBody.position.set(0, -8, 0);
  return towerBody;
}

// 上海环球中心
function getShangHaiGlobalFinancialCenter(x, y, z) {
  let ShangHaiGlobalFinancialCenter = new THREE.Object3D();
  // 获取 环球中心 底座
  let GlobalFinancialCenterBottom = getGlobalFinancialCenterBottom();

  // 获取 环球中心 顶部 =
  let GlobalFinancialCenterTriangularBodyTop = getGlobalFinancialCenterTriangularBodyTop();

  ShangHaiGlobalFinancialCenter.add(GlobalFinancialCenterBottom);
  ShangHaiGlobalFinancialCenter.add(GlobalFinancialCenterTriangularBodyTop);

  ShangHaiGlobalFinancialCenter.position.set(x, y, z);
  ShangHaiGlobalFinancialCenter.scale.set(0.81, 0.81, 0.81);
  ShangHaiGlobalFinancialCenter.castShadow = true;
  ShangHaiGlobalFinancialCenter.receiveShadow = true;

  return ShangHaiGlobalFinancialCenter;
}

// 获取 环球中心 顶部三角体底座
function getGlobalFinancialCenterTriangularBodyTop() {
  let globalFinancialCenterBodyTop = new THREE.Object3D();

  // 自定义左几何体
  let vertices1 = [
    new THREE.Vector3(-3, 30, 1.5), // 6 // 0
    new THREE.Vector3(-3, 35, 3), // 1
    new THREE.Vector3(-3, 30, 3), // 2
    new THREE.Vector3(-1.5, 30, 3), // 3
    new THREE.Vector3(-2, 35, 2) // 4
  ]; //顶点坐标，一共8个顶点
  let faces1 = [
    new THREE.Face3(1, 2, 3),
    new THREE.Face3(1, 3, 4),
    new THREE.Face3(0, 4, 3),
    new THREE.Face3(1, 4, 0),
    new THREE.Face3(1, 0, 2)
  ]; //顶点索引，每一个面都会根据顶点索引的顺序去绘制线条
  let triangularGeometryBody_top1 = new THREE.Geometry();
  triangularGeometryBody_top1.vertices = vertices1;
  triangularGeometryBody_top1.faces = faces1;
  triangularGeometryBody_top1.computeFaceNormals(); //计算法向量，会对光照产生影响
  let _material = new THREE.MeshPhongMaterial({
    color: "rgb(12,20,30)"
  });

  let triangularBodyTop1 = new THREE.Mesh(
    triangularGeometryBody_top1,
    _material
  );

  // 自定义左圆锥
  let gone_vertices1 = [
    new THREE.Vector3(-3, 30, 1.5), // 0
    new THREE.Vector3(-2.5, 30, 1), // 1
    new THREE.Vector3(-1, 30, 2.5), // 2
    new THREE.Vector3(-1.5, 30, 3), // 3
    new THREE.Vector3(-2.5, 35, 2.5), // 4
    new THREE.Vector3(-2, 35, 2) // 5
  ]; //顶点坐标，一共8个顶点
  let gone_faces1 = [
    new THREE.Face3(0, 2, 3),
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(0, 4, 3),
    new THREE.Face3(5, 2, 1),
    new THREE.Face3(4, 3, 2),
    new THREE.Face3(4, 2, 5),
    new THREE.Face3(1, 0, 4),
    new THREE.Face3(4, 5, 1)
  ]; //顶点索引，每一个面都会根据顶点索引的顺序去绘制线条
  let goneGeometry1 = new THREE.Geometry();
  goneGeometry1.vertices = gone_vertices1;
  goneGeometry1.faces = gone_faces1;
  goneGeometry1.computeFaceNormals(); //计算法向量，会对光照产生影响
  let gone1 = new THREE.Mesh(goneGeometry1, _material);

  // 自定义右几何体
  let vertices2 = [
    new THREE.Vector3(3, 30, -1.5), // 0
    new THREE.Vector3(1.5, 30, -3), // 1
    new THREE.Vector3(2, 35, -2), // 2
    new THREE.Vector3(3, 35, -3), // 3
    new THREE.Vector3(3, 30, -3) // 4
  ]; //顶点坐标，一共8个顶点
  let faces2 = [
    new THREE.Face3(4, 3, 0),
    new THREE.Face3(3, 2, 0),
    new THREE.Face3(3, 4, 1),
    new THREE.Face3(2, 3, 1),
    new THREE.Face3(0, 2, 1)
  ]; //顶点索引，每一个面都会根据顶点索引的顺序去绘制线条
  let triangularGeometryBody_top2 = new THREE.Geometry();
  triangularGeometryBody_top2.vertices = vertices2;
  triangularGeometryBody_top2.faces = faces2;
  triangularGeometryBody_top2.computeFaceNormals(); //计算法向量，会对光照产生影响
  let triangularBodyTop2 = new THREE.Mesh(
    triangularGeometryBody_top2,
    _material
  );

  // 自定义右圆锥
  let gone_vertices2 = [
    new THREE.Vector3(3, 30, -1.5), // 0
    new THREE.Vector3(1.5, 30, -3), // 1
    new THREE.Vector3(2, 35, -2), // 2
    new THREE.Vector3(2.5, 35, -2.5), // 3
    new THREE.Vector3(2.5, 30, -1), // 4
    new THREE.Vector3(1, 30, -2.5) // 5
  ]; //顶点坐标，一共8个顶点
  let gone_faces2 = [
    new THREE.Face3(0, 2, 4),
    new THREE.Face3(4, 2, 3),
    new THREE.Face3(1, 2, 3),
    new THREE.Face3(3, 5, 1),
    new THREE.Face3(5, 4, 3),
    new THREE.Face3(4, 0, 1),
    new THREE.Face3(1, 5, 2),
    new THREE.Face3(4, 5, 1),
    new THREE.Face3(5, 2, 3)
  ]; //顶点索引，每一个面都会根据顶点索引的顺序去绘制线条
  let goneGeometry2 = new THREE.Geometry();
  goneGeometry2.vertices = gone_vertices2;
  goneGeometry2.faces = gone_faces2;
  goneGeometry2.computeFaceNormals(); //计算法向量，会对光照产生影响
  let gone2 = new THREE.Mesh(goneGeometry2, _material);

  // 自定义上边框
  let goneTopGeometry = new THREE.PlaneGeometry(8, 2, 32);
  let gonemMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(12,20,30)",
    side: THREE.DoubleSide
  });
  let goneTop = new THREE.Mesh(goneTopGeometry, gonemMaterial);

  goneTop.position.set(0, 34, 0);
  goneTop.rotation.set(0, Math.PI / 4, 0);

  globalFinancialCenterBodyTop.add(triangularBodyTop1);
  globalFinancialCenterBodyTop.add(gone1);
  globalFinancialCenterBodyTop.add(triangularBodyTop2);
  globalFinancialCenterBodyTop.add(gone2);
  globalFinancialCenterBodyTop.add(goneTop);

  return globalFinancialCenterBodyTop;
}
// 获取 环球中心 底座
function getGlobalFinancialCenterBottom() {
  let vertices = [
    // 底部
    new THREE.Vector3(3, 0, 3), // 0
    new THREE.Vector3(3, 0, -3), // 1
    new THREE.Vector3(-3, 0, 3), // 2
    new THREE.Vector3(-3, 0, -3), // 3
    // 中部
    new THREE.Vector3(3, 10, 3), // 4
    new THREE.Vector3(-3, 10, -3), // 5
    // 上部
    new THREE.Vector3(-1.5, 30, 3), // 6
    new THREE.Vector3(3, 30, -1.5), // 7
    new THREE.Vector3(3, 30, -3), // 8
    new THREE.Vector3(1.5, 30, -3), // 9
    new THREE.Vector3(-3, 30, 1.5), // 10
    new THREE.Vector3(-3, 30, 3) // 11
  ]; //顶点坐标，一共8个顶点
  // 如果要绘制的面是朝向相机的，那这个面的顶点的书写方式是逆时针绘制的，比如图上模型的第一个面的添加里面书写的是(0,1,2)。
  let faces = [
    // 底部2个三角形
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(3, 2, 1),
    // 每个面的 3个三角形
    // 1.
    new THREE.Face3(6, 2, 0),
    new THREE.Face3(0, 4, 6),
    new THREE.Face3(11, 2, 6),
    // 2.
    new THREE.Face3(0, 1, 7),
    new THREE.Face3(7, 4, 0),
    new THREE.Face3(8, 7, 1),
    // 3.
    new THREE.Face3(1, 3, 9),
    new THREE.Face3(9, 8, 1),
    new THREE.Face3(3, 5, 9),
    // 4.
    new THREE.Face3(10, 3, 2),
    new THREE.Face3(11, 10, 2),
    new THREE.Face3(10, 5, 3),
    // 顶部4个三角形
    new THREE.Face3(6, 10, 11),
    new THREE.Face3(7, 8, 9),
    new THREE.Face3(6, 7, 10),
    new THREE.Face3(7, 9, 10),
    // 两个剖面 三角形
    new THREE.Face3(7, 6, 4),
    new THREE.Face3(10, 9, 5)
  ]; //顶点索引，每一个面都会根据顶点索引的顺序去绘制线条
  let globalGeometry_bottom = new THREE.Geometry();
  globalGeometry_bottom.vertices = vertices;
  globalGeometry_bottom.faces = faces;
  globalGeometry_bottom.computeFaceNormals(); //计算法向量，会对光照产生影响
  let _material = new THREE.MeshPhongMaterial({
    color: "rgb(12,20,30)"
  });

  // 贴图纹理 问题: 自定义形状 贴图问题
  // let texture = loader.load("./assets/textures/JMtowerbody.jpg"); // 颜色贴图
  // _material.map = texture;
  // _material.map.wrapS = THREE.RepeatWrapping; // 水平方向重复贴图 为了保证贴图的质量
  // _material.map.wrapT = THREE.RepeatWrapping; // 竖直方向重复贴图
  // _material.map.repeat.set(0.5, 1);
  // _material.skinning = true;

  let globalFinancialCenter = new THREE.Mesh(globalGeometry_bottom, _material);
  return globalFinancialCenter;
}
// 上海中心大厦
function getShanghaiTower(x, y, z) {
  let _geometry = new THREE.CylinderGeometry(2, 3, 18, 7, 50);
  _geometry.vertices.forEach((vertex, ind) => {
    // 正弦函数规律性的改变顶点坐标的x轴和z轴
    vertex.z = vertex.z + Math.sin((vertex.y + ind) * 0.015);
    vertex.x = vertex.x + Math.sin((vertex.y + ind) * 0.01) * 1;
    if (vertex.y >= 8.5) {
      // 斜塔尖
      vertex.y -= vertex.x * 0.2;
    }
  });
  _geometry.verticesNeedUpdate = true;

  _geometry.wireframe = true;
  let _material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });

  _material.map = loader.load("./assets/textures/building5.jpg"); // 颜色贴图
  _material.map.wrapS = THREE.RepeatWrapping; // 水平方向重复贴图 为了保证贴图的质量
  _material.map.wrapT = THREE.RepeatWrapping; // 竖直方向重复贴图
  _material.map.repeat.set(2, 9);

  let tower = new THREE.Mesh(_geometry, _material);
  tower.position.set(x, y, z);
  tower.scale.set(1, 2, 0.5);
  tower.castShadow = true;
  tower.receiveShadow = true;

  return tower;
}

// 东方明珠
function getOrientalPearl() {
  let orientalPearl = new THREE.Object3D();
  // 1. 底部圆台 2个圆柱
  let bottom = new THREE.Object3D();
  // 圆台1
  let cylinder1_geometry = new THREE.CylinderGeometry(2, 2, 0.38, 30);
  let cylinder1_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let cylinder1 = new THREE.Mesh(cylinder1_geometry, cylinder1_material);
  cylinder1.castShadow = true;
  cylinder1.receiveShadow = true;

  // 圆台2
  let cylinder2_geometry = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 30);
  let cylinder2_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let cylinder2 = new THREE.Mesh(cylinder2_geometry, cylinder2_material);
  cylinder2.position.y = 0.28;
  cylinder2.castShadow = true;
  cylinder2.receiveShadow = true;

  // 底部小斜体圆柱1
  let little_bottom_cylinder1_geometry = new THREE.CylinderGeometry(
    0.15,
    0.15,
    3,
    30
  );
  let little_bottom_cylinder1_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let little_bottom_cylinder1 = new THREE.Mesh(
    little_bottom_cylinder1_geometry,
    little_bottom_cylinder1_material
  );
  little_bottom_cylinder1.position.set(1.1, 1, 0.5);
  little_bottom_cylinder1.rotation.set(
    (Math.PI / 2) * 1.15,
    (Math.PI / 5.5) * 1.5,
    (-Math.PI / 2.5) * 1.1
  );

  // 底部小斜体圆柱2
  let little_bottom_cylinder2_geometry = new THREE.CylinderGeometry(
    0.15,
    0.15,
    3,
    30
  );
  let little_bottom_cylinder2_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let little_bottom_cylinder2 = new THREE.Mesh(
    little_bottom_cylinder2_geometry,
    little_bottom_cylinder2_material
  );
  little_bottom_cylinder2.position.set(-0.05, 1, -1.35);
  little_bottom_cylinder2.rotation.set(
    (Math.PI / 2) * 1.47,
    -(Math.PI / 5.5) * 1.35,
    (Math.PI / 2.5) * 0.05
  );

  // 底部小斜体圆柱3
  let little_bottom_cylinder3_geometry = new THREE.CylinderGeometry(
    0.15,
    0.15,
    3,
    30
  );
  let little_bottom_cylinder3_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let little_bottom_cylinder3 = new THREE.Mesh(
    little_bottom_cylinder3_geometry,
    little_bottom_cylinder3_material
  );
  little_bottom_cylinder3.position.set(-1, 1, 0.8);
  little_bottom_cylinder3.rotation.set(
    -(Math.PI / 2) * 1.25,
    (Math.PI / 5.5) * 1,
    -(Math.PI / 3.5) * 0.9
  );

  // 底部支柱
  let bottom_cylinder = getBottomCylinder();
  bottom.add(
    cylinder1,
    cylinder2,
    bottom_cylinder,
    little_bottom_cylinder1,
    little_bottom_cylinder2,
    little_bottom_cylinder3
  );

  // 2. 中间部分 三个圆柱 + 圆球
  let body = new THREE.Object3D();

  // 圆柱1
  let body_cylinder1_geometry = new THREE.CylinderGeometry(0.35, 0.35, 15, 30);
  let body_cylinder1_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let body_cylinder1 = new THREE.Mesh(
    body_cylinder1_geometry,
    body_cylinder1_material
  );
  body_cylinder1.position.set(0, 7, 0.8);
  // 圆柱2
  let body_cylinder2_geometry = new THREE.CylinderGeometry(0.35, 0.35, 15, 30);
  let body_cylinder2_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let body_cylinder2 = new THREE.Mesh(
    body_cylinder2_geometry,
    body_cylinder2_material
  );
  body_cylinder2.position.set(0.7, 7, -0.5);
  // 圆柱3
  let body_cylinder3_geometry = new THREE.CylinderGeometry(0.35, 0.35, 15, 30);
  let body_cylinder3_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let body_cylinder3 = new THREE.Mesh(
    body_cylinder3_geometry,
    body_cylinder3_material
  );
  body_cylinder3.position.set(-0.7, 7, -0.45);

  // 圆环
  let torus1 = getTorus(0.8, 0.2, 16, 10, 2);
  let torus2 = getTorus(0.8, 0.2, 16, 10, 7.5);
  let torus3 = getTorus(0.8, 0.2, 16, 10, 8.6);
  let torus4 = getTorus(0.8, 0.2, 16, 10, 9.7);
  let torus5 = getTorus(0.8, 0.2, 16, 10, 10.8);
  let torus6 = getTorus(0.8, 0.2, 16, 10, 11.9);
  let torus7 = getTorus(0.8, 0.2, 16, 10, 13);

  // 大球
  var sphere_big_geometry = new THREE.SphereGeometry(2, 32, 32);
  var sphere_big_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  var sphere_big = new THREE.Mesh(sphere_big_geometry, sphere_big_material);
  sphere_big.position.y = 5;

  // 中球
  var sphere_middle_geometry = new THREE.SphereGeometry(1.5, 32, 32);
  var sphere_middle_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
    // color: "rgb(175, 91, 123)"
  });
  var sphere_middle = new THREE.Mesh(
    sphere_middle_geometry,
    sphere_middle_material
  );
  sphere_middle.position.y = 15;

  body.add(body_cylinder1);
  body.add(body_cylinder2);
  body.add(body_cylinder3);
  body.add(torus1);
  body.add(torus2);
  body.add(torus3);
  body.add(torus4);
  body.add(torus5);
  body.add(torus6);
  body.add(torus7);
  body.add(sphere_big);
  body.add(sphere_middle);

  // 顶部
  let head = new THREE.Object3D();
  // 顶部圆柱1
  let head_cylinder1_geometry = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 5);
  let head_cylinder1_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let head_cylinder1 = new THREE.Mesh(
    head_cylinder1_geometry,
    head_cylinder1_material
  );
  head_cylinder1.position.y = 17.5;

  // 顶部球1
  var head_sphere_geometry = new THREE.SphereGeometry(0.6, 32, 32);
  var head_sphere_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  var head_sphere = new THREE.Mesh(head_sphere_geometry, head_sphere_material);
  head_sphere.position.y = 19;

  // 顶部圆柱2
  let head_cylinder2_geometry = new THREE.CylinderGeometry(0.25, 0.2, 3, 5);
  let head_cylinder2_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let head_cylinder2 = new THREE.Mesh(
    head_cylinder2_geometry,
    head_cylinder2_material
  );
  head_cylinder2.position.y = 20;

  let head_torus1 = getTorus(0.15, 0.15, 16, 10, 21.5);

  // 顶部圆柱3
  let head_cylinder3_geometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 10);
  let head_cylinder3_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let head_cylinder3 = new THREE.Mesh(
    head_cylinder3_geometry,
    head_cylinder3_material
  );
  head_cylinder3.position.y = 22.5;
  let head_torus2 = getTorus(0.13, 0.13, 16, 10, 23.5);

  // 顶部圆柱4
  let head_cylinder4_geometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 10);
  let head_cylinder4_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let head_cylinder4 = new THREE.Mesh(
    head_cylinder4_geometry,
    head_cylinder4_material
  );
  head_cylinder4.position.y = 25;

  head.add(head_sphere, head_torus1, head_torus2, head_cylinder4);
  head.add(head_cylinder1, head_cylinder2, head_cylinder3);

  orientalPearl.add(bottom);
  orientalPearl.add(body);
  orientalPearl.add(head);
  orientalPearl.castShadow = true;
  orientalPearl.receiveShadow = true;

  return orientalPearl;
}

function getBottomCylinder() {
  // 获取底部斜体圆柱
  let object = new THREE.Object3D();

  // 圆柱1
  let bottom_cylinder1_geometry = new THREE.CylinderGeometry(0.2, 0.2, 7, 30);
  let bottom_cylinder1_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let bottom_cylinder1 = new THREE.Mesh(
    bottom_cylinder1_geometry,
    bottom_cylinder1_material
  );

  // 圆柱2
  let bottom_cylinder2_geometry = new THREE.CylinderGeometry(0.2, 0.2, 7, 30);
  let bottom_cylinder2_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let bottom_cylinder2 = new THREE.Mesh(
    bottom_cylinder2_geometry,
    bottom_cylinder2_material
  );

  // 圆柱3
  let bottom_cylinder3_geometry = new THREE.CylinderGeometry(0.2, 0.2, 7, 30);
  let bottom_cylinder3_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let bottom_cylinder3 = new THREE.Mesh(
    bottom_cylinder3_geometry,
    bottom_cylinder3_material
  );

  // 圆柱中间球
  var sphere1 = getBottomSphere();
  var sphere2 = getBottomSphere();
  var sphere3 = getBottomSphere();

  bottom_cylinder1.add(sphere1);
  bottom_cylinder2.add(sphere2);
  bottom_cylinder3.add(sphere3);

  bottom_cylinder1.position.set(2, 2, 1);
  bottom_cylinder1.rotation.set(-(Math.PI / 5.5), Math.PI / 10, Math.PI / 5);

  bottom_cylinder2.position.set(0, 2, -2.5);
  bottom_cylinder2.rotation.set(Math.PI / 4.5, Math.PI / 6, -Math.PI / 1);

  bottom_cylinder3.position.set(-2, 2, 1.5);
  bottom_cylinder3.rotation.set(
    -Math.PI / 15,
    Math.PI / 8,
    (-Math.PI / 10) * 2
  );

  object.add(bottom_cylinder1, bottom_cylinder2, bottom_cylinder3);
  return object;
}

function getBottomSphere() {
  var sphere_geometry = new THREE.SphereGeometry(0.32, 32, 32);
  var sphere_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  var sphere = new THREE.Mesh(sphere_geometry, sphere_material);
  return sphere;
}

function getTorus(a, b, c, d, y) {
  let torus_geometry = new THREE.TorusGeometry(a, b, c, d);
  let torus_material = new THREE.MeshPhongMaterial({
    color: MATERIAL_COLOR
  });
  let torus = new THREE.Mesh(torus_geometry, torus_material);
  torus.radius = 8;
  torus.tube = 2;
  torus.radialSegments = 7;
  torus.tubularSegments = 30;
  torus.rotation.x = Math.PI / 2;
  torus.position.y = y;
  return torus;
}

function getSpotLight(intensity) {
  let light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;
  light.receiveShadow = true;
  light.shadow.bias = 0.0005;
  light.shadow.mapSize.width = SHADOW_MAPSIZE;
  light.shadow.mapSize.height = SHADOW_MAPSIZE;
  return light;
}

function getGroundBehind() {
  let shape = new THREE.Shape();
  shape.moveTo(45, 100); // moveTo( x, y )
  shape.lineTo(50, 100); // lineTo( x, y ) - 线
  shape.lineTo(50, 0); // lineTo( x, y ) - 线
  shape.lineTo(-50, 0); // lineTo( x, y ) - 线
  shape.lineTo(-50, 60); // lineTo( x, y ) - 线
  shape.bezierCurveTo(5, 15, 15, 5, 45, 100);

  let extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 3,
    steps: 2,
    bevelThickness: 0,
    bevelSize: 1
  });

  let material = new THREE.MeshLambertMaterial({ color: "gray" });

  let mesh = new THREE.Mesh(extrudeGeometry, material);

  mesh.receiveShadow = true;
  mesh.rotation.x = Math.PI + Math.PI / 2; // 地面旋转180度
  mesh.rotation.y = Math.PI; // 地面旋转180度

  mesh.position.set(0, 0, 50);
  return mesh;
}

function getGroundFront() {
  let shape = new THREE.Shape();
  shape.moveTo(50, 0); // moveTo( x, y )
  shape.lineTo(-25, 0); // lineTo( x, y ) - 线
  shape.quadraticCurveTo(-10, 107, 50, 15); // 二次曲线

  let extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 3,
    steps: 2,
    bevelThickness: 0,
    bevelSize: 1
  });

  let material = new THREE.MeshLambertMaterial({ color: "#666" });

  let mesh = new THREE.Mesh(extrudeGeometry, material);

  mesh.receiveShadow = true;
  mesh.rotation.x = Math.PI / 2; // 地面旋转90度
  mesh.position.set(0, 0, -50);
  return mesh;
}

function getRiver() {
  // 标准网络材质 MeshStandardMaterial
  /*基于物理的渲染（PBR）最近已成为许多3D应用程序的标准，例如Unity， Unreal和 3D Studio Max。*/
  /*在实践中，该材质提供了比MeshLambertMaterial 或MeshPhongMaterial 更精确和逼真的结果，代价是计算成本更高。*/
  let material = new THREE.MeshStandardMaterial({
    color: MATERIAL_COLOR
  });

  material.map = loader.load("./assets/textures/river.jpg");
  material.bumpMap = loader.load("./assets/textures/river.jpg");
  material.roughnessMap = loader.load("./assets/textures/river.jpg");
  material.bumpScale = 0.01;
  material.metalness = 0.1;
  material.roughness = 0.7;
  // 透明度
  material.transparent = true;
  material.opacity = 0.85;

  let geometry = new THREE.PlaneGeometry(73, 100, 60, 60);
  material.side = THREE.DoubleSide;
  let river = new THREE.Mesh(geometry, material);
  river.receiveShadow = true;
  // river.castShadow = true;

  river.rotation.x = Math.PI / 2;
  river.rotation.z = Math.PI / 2;
  river.position.z = -14.5;
  river.position.y = -2;

  return river;
}

function update(renderer, scene, camera, controls, stats, clock) {
  renderer.render(scene, camera);

  // 性能监控
  stats.update();

  // 相机轨道控制器
  controls.update();

  // 获取时间
  let elapsedTime = clock.getElapsedTime();

  let plane = scene.getObjectByName("river");
  let planeGeo = plane.geometry;

  planeGeo.vertices.forEach((vertex, ind) => {
    vertex.z = Math.sin(elapsedTime + ind * 0.3) * 0.5;
  });
  planeGeo.verticesNeedUpdate = true;

  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(renderer, scene, camera, controls, stats, clock);
  });
}
