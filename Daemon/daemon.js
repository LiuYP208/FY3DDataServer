/**
 * Created by �� on 2015/10/10.
 * �������ļ������ݿ�/�ļ������ ά����ؽ��̵���ͣ����������������Ĺ��ܣ�
 * 1. �����ػ�����
 * 2. ��������ܣ�RESTfulServer �����鿴�����ơ������ȣ�
 *      - �ػ����̵�API�����������README.md
 * 3. ������־��¼�����
 * PS: Ŀǰ����JSON�ļ��������������Ϣ��δ��������Ϊ�����ݿⷽʽ�洢��
 */

'use strict';

var psCtrl = require('./lib/processCtrl');
var restServer = require('./daemonServer');
var http = require('http');
var processModuleList = []; //���̶����б�,��readProcessConfig�����г�ʼ��


start();

function start(){
    daemon();
    daemonServer();
};

/**
 * ʵ�ֽ����ػ�����.
 */
function daemon(){
    initDaemon();
    startDaemon();
};

/**
 * ��ʼ���ػ�����
 * 1.��ȡ����������Ϣ��
 * 2.�������ڼ�¼����״̬�� processModule �б�
 * ...
 */
function initDaemon() {
    var processList = readProcessConfig();
    createProcessModuleList(processList);
};

/**
 * ��ȡ���������ļ�
 * �� createProcessModuleList() ʹ��
 * Ŀǰ����JSON�ļ��������������Ϣ��δ��������Ϊ�����ݿⷽʽ�洢��
 * @returns {*}
 */
function readProcessConfig(){
    var processList = require('./config/processConfig.json');
    return processList;
}

/**
 * �������̶����б�
 * processModule ����¼����״̬�Ķ���
 *  - name ������
 *  - path ����ʵ�ʻ����·��
 *  - workingDir ���̹���Ŀ¼
 *  - max ����������������������״���������� = 0 ��ʾ���޴�����
 *  - sleepTime �����������
 *  - isValid �Ƿ���Ч 1 = ��Ч�� 0 = ��Ч
 *  - port ����ʹ��TCPʱ����Ķ˿ں�
 *  - count ������������
 *  - pid ����id
 *  - status ���̵�ǰ״̬ (0 = unrunning; 1 = running; 2 = stop)
 */
function createProcessModuleList(processList) {
    for(var i = 0; i < processList.length; i++){
        if(processList[i].hasOwnProperty('isValid') && processList[i]['isValid'] === '1'){

            //�������̶���
            if(!processList[i].hasOwnProperty('name') || !processList[i].hasOwnProperty('path')){
                continue;
            }
            var processModule = psCtrl.createProcessModule();
            for(var prop in processList[i]){
                processModule[prop] = processList[i][prop];
            }

            processModuleList.push(processModule);
        }
    }
}

/**
 * �����ػ�����
 *
 */
function startDaemon() {
    for(var i = 0; i < processModuleList.length; i++){
        if(processModuleList[i].isValid == 1){
            psCtrl.createPsCtrl().start(processModuleList[i]);
        }
    }
}

/**
 * �ػ����̵ķ�����
 */
function daemonServer(){
    restServer.init(processModuleList);
    restServer.start();
}
