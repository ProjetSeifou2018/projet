"use strict";

angular.module('shared')

    .factory('AssignResources', ['ModalService' , function (ModalService) {
        var factory = this;

        function AssignResources() {
            var self = this;

            function AssignResourcesController(folders, fileCabinetRibbonService, resourceList,close,studentList,MessageBox,$http, messageHandler, $window, Authorization, SiteHelper, _) {
                var ctrl = this;

                var init = function() {
                    ctrl.startDate = 'No Due Date';
                    ctrl.message = '';
                    ctrl.title = resourceList.getAssignmentTitle();
                    ctrl.customAssignment = resourceList.getCustomAssignment();
                    ctrl.canRead = false;
                    ctrl.canListen = false;
                    ctrl.canQuiz = false;
                    ctrl.read = false;
                    ctrl.listen = false;
                    ctrl.quiz = false;
                    ctrl.resourceCount = 0;

                    studentList.get().$promise.then(function (students) {
                        if (ctrl.customAssignment && ctrl.customAssignment.students) {
                            setSelectedAndCompletedStudentsFromCustomAssignment()
                        } else {
                            studentList.clearSelected();
                        }
                    }).then(function () {
                        var license_type = Authorization.getLicenseTypeForResourceCollection(getResourceLicenseTypes());
                        studentList.annotateSelectableStudents([
                            Authorization.studentWithoutPrivilegeCheckerFactory(SiteHelper.RK_SITE_ABBREVIATION),
                            assignmentCompletedChecker,
                            Authorization.studentWithoutResourceLicenseCheckerFactory(license_type, ctrl.resourceCount == 1 ? 'this resource' : 'these resources')
                        ])
                    })
                    var r1 = resourceList.getResources();
                    var r2 = new Array();
                    if (ctrl.customAssignment != null) {
                        if (ctrl.customAssignment.assignment_name != null) {
                            ctrl.title = ctrl.customAssignment.assignment_name;
                        }
                        if (ctrl.customAssignment.message != null) {
                            ctrl.message = ctrl.customAssignment.message;
                        }
                        if (ctrl.customAssignment.due_on != null) {
                            ctrl.startDate = ctrl.customAssignment.due_on;
                        }
                        if (ctrl.customAssignment.resources != null) {
                            r2 = ctrl.customAssignment.resources;
                        }
                    }
                    if (r1 != null && r2 != null) {
                        for (var counter = 0;counter < r1.length;counter++) {
                            var resourcedIDs = r1[counter].resourceIDs;
                            for (var counter2 = 0;counter2 < resourcedIDs.length;counter2++) {
                                var resourceID = resourcedIDs[counter2];
                                if (r2[resourceID.id] && r2[resourceID.id][resourceID.cbtype]) {
                                    resourceID.checked = true;
                                    r1[counter].isChecked = true;
                                    ctrl.listen = ctrl.listen || resourceID.cbtype == 1;
                                    ctrl.read = ctrl.read || resourceID.cbtype == 2;
                                    ctrl.quiz = ctrl.quiz || resourceID.cbtype == 3;
                                }
                            }
                        }
                    }
                    var resources = resourceList.getResources();
                    for (var counter = 0;counter < resources.length;counter++) {
                        var thisHaveRead = false;
                        var thisHaveListen = false;
                        var thisHaveQuiz = false;
                        var resource = resources[counter];
                        if (resource.rtype != 3) {
                            ctrl.resourceCount++;
                        }
                        var resourceIDs = resource.resourceIDs;
                        if (resourceIDs == null) {
                            continue;
                        }
                        for (var counter2 = 0;counter2 < resourceIDs.length;counter2++) {
                            if (resource.rtype == 3) {
                                ctrl.resourceCount++;
                            }
                            var resourceID = resourceIDs[counter2];
                            switch (resourceID.cbtype) {
                                case 1: thisHaveListen = true; break;
                                case 2: thisHaveRead = true; break;
                                case 3: thisHaveQuiz = true; break;
                            }
                        }
                        resource.canRead = thisHaveRead;
                        resource.canListen = thisHaveListen;
                        resource.canQuiz = thisHaveQuiz;
                        ctrl.canRead = ctrl.canRead || thisHaveRead;
                        ctrl.canListen = ctrl.canListen || thisHaveListen;
                        ctrl.canQuiz = ctrl.canQuiz || thisHaveQuiz;
                    }
                    // For new assignments, check all available options
                    if (ctrl.customAssignment == null) {
                        if (ctrl.canRead) {
                            ctrl.read = true;
                            ctrl.markReadListenQuiz(2,true);
                        }
                        if (ctrl.canListen) {
                            ctrl.listen = true;
                            ctrl.markReadListenQuiz(1,true);
                        }
                        if (ctrl.canQuiz) {
                            ctrl.quiz = true;
                            ctrl.markReadListenQuiz(3,true);
                        }
                    }
                    function assignmentCompletedChecker(student) {
                        if (student.completed) {
                            return 'Student has completed the assignment'
                        }
                    }
                    function setSelectedAndCompletedStudentsFromCustomAssignment() {
                        _.each(studentList.get(), function (student) {
                            var assignmentStudent = student.reading_student_account_id ? ctrl.customAssignment.students[student.reading_student_account_id] : null;
                            if (assignmentStudent) {
                                student.selected = true;
                                student.completed = !!assignmentStudent.completed_at;
                            } else {
                                student.selected = false;
                                student.completed = false;
                            }
                        })
                    }
                    function getResourceLicenseTypes() {
                        if (ctrl.customAssignment) {
                            return [ { license_type: ctrl.customAssignment.license_type } ];
                        } else {
                            return _.reduce(ctrl.getCurrentAssignableResources(), function (memo, resource) {
                                if ('license_type' in resource) {
                                    memo.push(resource)
                                } else if ('resourceIDs' in resource) {
                                    _.reduce(resource.resourceIDs, function (memo, subresource) {
                                        if ('license_type' in subresource) {
                                            memo.push(subresource)
                                        }
                                        return memo;
                                    }, memo)
                                }
                                return memo;
                            }, [])
                        }
                    }
                };

                ctrl.markReadListenQuiz = function(type,isChecked) {
                    var resources = resourceList.getResources();
                    for (var counter = 0;counter < resources.length;counter++) {
                        var resource = resources[counter];
                        var resourceIDs = resource.resourceIDs;
                        if (resourceIDs == null) {
                            continue;
                        }
                        for (var counter2 = 0;counter2 < resourceIDs.length;counter2++) {
                            var resourceID = resourceIDs[counter2];
                            if (resourceID.cbtype == type) {
                                resourceID.checked = isChecked;
                            }
                        }
                    }
                };
                init();

                ctrl.getLocked = function() {
                    return resourceList.getCustomAssignment() != null;
                };

                ctrl.qualifierText = function(resourceRecord) {
                    if ((ctrl.canRead && !resourceRecord.canRead) || (ctrl.canListen && !resourceRecord.canListen) || (ctrl.canQuiz && !resourceRecord.canQuiz)) {
                        var ret = "";
                        if (resourceRecord.canRead) {
                            ret = ret + "Read/";
                        }
                        if (resourceRecord.canListen) {
                            ret = ret + "Listen/";
                        }
                        if (resourceRecord.canQuiz) {
                            ret = ret + "Quiz/";
                        }
                        ret = ret.slice(0, -1);
                        return "(" + ret + " Only)";
                    }
                    return "";
                };


                ctrl.buttonText = function() {
                    if (ctrl.customAssignment == null) {
                        return 'Assign e-Resources';
                    }
                    return 'Update Assignment';
                };

                ctrl.close = function () {
                    close();
                };

                ctrl.getCurrentAssignableResources = function() {
                    return resourceList.getResources();
                };


                ctrl.getResourceStyle = function() {
                    if (resourceList.getResources().length > 7) {
                        return "overflow:auto; height:155px;";
                    }
                    else {
                        return "";
                    }
                };

                ctrl.checkedResource = function(resourceRecord) {
                    for (var counter = 0;counter < resourceRecord.resourceIDs.length;counter++) {
                        var r = resourceRecord.resourceIDs[counter];
                        r.checked = resourceRecord.isChecked;
                    }
                };

                ctrl.checkedResourceOption = function(resourceRecord) {
                    var totOptions = 0;
                    var totChecked = 0;
                    for (var counter = 0;counter < resourceRecord.resourceIDs.length;counter++) {
                        var r = resourceRecord.resourceIDs[counter];
                        totOptions++;
                        if (r.checked) {
                            totChecked++;
                        }
                    }
                    resourceRecord.isChecked = totChecked > 0;
                };

                ctrl.isNewlySelectedStudent = function(studentAccountID) {
                    var originalList = new Array();
                    if (ctrl.customAssignment != null && ctrl.customAssignment.students != null) {
                        originalList = ctrl.customAssignment.students;
                    }
                    return originalList[studentAccountID] == null;
                };

                ctrl.setAssignedResources = function() {
                    if (ctrl.savingData) {
                        console.log('double click');
                        return;
                    }
                    ctrl.savingData = true;
                    var studentIDsAsDelimitedString = '';
                    var selectedStudents = [];
                    var selectedStudentIDs = [];
                    var selectedStudentAccounts = [];
                    var allStudents = [];
                    var selStudent = studentList.get();
                    if (selStudent != null) {
                        for (var i=0; i < selStudent.length; i++) {
                            var student = selStudent[i];
                            if (student.hasOwnProperty('reading_student_account_id')) {
                                allStudents.push(student.student_id);
                                if (student.hasOwnProperty('selected') && student.selected == true) {
                                    selectedStudents.push(student);
                                    selectedStudentIDs.push(student.student_id);
                                    selectedStudentAccounts.push(student.reading_student_account_id);
                                    studentIDsAsDelimitedString = studentIDsAsDelimitedString + student.student_id + ',';
                                }
                            }
                        }
                    }
                    if (studentIDsAsDelimitedString.length < 1) {
                        studentIDsAsDelimitedString = 0;
                    } else {
                        studentIDsAsDelimitedString = studentIDsAsDelimitedString.slice(0, -1);
                    }
                    var url = "/api/resources/getAssignedResourceCount/" + studentIDsAsDelimitedString;
                    $http.get(url).then(function successCallback(response) {
                        var thisHasRead = false;
                        var thisHasListen = false;
                        var thisHasQuiz = false;

                        var limitLookup = JSON.parse(response.data);
                        var selectedResources = [];
                        var selectedResourcesWithActivities = [];
                        var resources = resourceList.getResources();
                        for (var i=0; i < resources.length; i++) {
                            var resource = resources[i];
                            var resourceIDs = resource['resourceIDs'];
                            for (var x=0; x < resourceIDs.length; x++) {
                                var resourceID = resourceIDs[x];
                                if (resourceID.checked) {
                                    var myObj = {id2:resourceID.id, cbtype:resourceID.cbtype};
                                    selectedResources.push(myObj);
                                    thisHasListen = thisHasListen || resourceID.cbtype == 1;
                                    thisHasQuiz = thisHasQuiz || resourceID.cbtype == 3;
                                    thisHasRead = thisHasRead || resourceID.cbtype == 2;
                                    var selectedResourceObj = {resource:resource, thisHasListen:thisHasListen, thisHasQuiz:thisHasQuiz, thisHasRead:thisHasRead};
                                    selectedResourcesWithActivities.push(selectedResourceObj);
                                }
                            }
                        }
                        var allStudentsStr = JSON.stringify(allStudents);
                        var selectedStudentsStr = JSON.stringify(selectedStudentIDs);
                        var selectedResourcesStr = JSON.stringify(selectedResources);

                        var message = ctrl.message;
                        if (message == null || message.trim().length < 1) {
                            message = '';
                        }
                        var title = ctrl.title;
                        if (title == null || title.trim().length < 1) {
                            title = '';
                        }
                        var startDate = ctrl.startDate;
                        if (startDate == null || startDate.trim().length < 1) {
                            startDate = '';
                        }

                        var errorMessage = '';
                        if (title.trim().length < 1) {
                            errorMessage = errorMessage + " and enter a title";
                        }
                        if (selectedResources.length < 1) {
                            errorMessage = errorMessage + " and choose at least one activity";
                        } else {
                            errorMessage = errorMessage + ctrl.generateErrorByResource(selectedResourcesWithActivities);
                        }
                        if (selectedStudents.length < 1) {
                            errorMessage = errorMessage + " and choose at least one student";
                        }
                        if (errorMessage.length < 1 && selectedStudents != null) {
                            for (var i=0; i < selectedStudents.length; i++) {
                                var studentID = selectedStudentIDs[i];
                                var studentAccount = selectedStudentAccounts[i];
                                var limit = limitLookup[studentID];
                                if (ctrl.isNewlySelectedStudent(studentAccount) && (limit + ctrl.resourceCount) >= 100) {
                                    errorMessage = errorMessage + ', ' + selectedStudents[i].student_name;
                                }
                            }
                            if (errorMessage.length > 0) {
                                errorMessage = errorMessage.trim() + ".";
                                errorMessage = errorMessage.substr(2);
                                errorMessage = "The follow students have exceeded their assignment limit: " + errorMessage;
                            }
                        }
                        else  {
                            errorMessage = errorMessage.trim() + ".";
                            errorMessage = errorMessage.substr(3);
                            errorMessage = "Please" + errorMessage;
                        }
                        if (errorMessage.length > 0) {
                            ctrl.savingData = false;
                            ctrl.showMessage(errorMessage);
                        }
                        else {
                            var custom_assignment_id = ctrl.customAssignment == null ? 0 : ctrl.customAssignment.custom_assignment_id;
                            var data = {
                                custom_assignment_id: custom_assignment_id,
                                allStudentsStr: allStudentsStr,
                                selectedStudentsStr: selectedStudentsStr,
                                selectedResourcesStr: selectedResourcesStr,
                                resource_collection_id: resourceList.getFolderID(),
                                message: encodeURI(message),
                                title: encodeURI(title),
                                startDate: encodeURI(startDate)
                            };
                            var url = "/api/resources/assignResources";
                            $http.post(url,JSON.stringify(data)).then(onRepos,onError);
                        }

                    }, onError);
                };

                ctrl.generateErrorByResource = function (selectedResourcesWithActivities) {
                    var resourceError = "";
                    for (var i=0; i < selectedResourcesWithActivities.length; i++) {
                        var selectedResource = selectedResourcesWithActivities[i];
                        if(selectedResource.thisHasQuiz && (!selectedResource.thisHasListen && selectedResource.resource.canListen) && (!selectedResource.thisHasRead && selectedResource.resource.canRead) ) {
                            resourceError = " and select a Read or Listen activity, in order to assign a quiz";
                        }
                    }
                    return resourceError;
                };

                var onRepos = function(response) {
                    close();
                    ctrl.savingData = false;
                    if (response.data) {
                        var parentcontroller = resourceList.getParentcontroller();
                        if (parentcontroller != null) {
                            parentcontroller.customAssignmentSaved();
                        }
                        if (fileCabinetRibbonService.ribbonActive()) {
                            fileCabinetRibbonService.closeFileCabinetRibbon();
                        }
                        messageHandler.publishSuccess('Assignment created. Track progress on the ','assignments page.',ctrl.assignmentRedirect);
                        /*if (resourceList.getFromRibbon()) {
                            var redirectMessage = "Click here to go to the '" + resourceList.getAssignmentTitle() + "' folder.";
                            messageHandler.publishSuccess('',redirectMessage,ctrl.fileCabinetRedirect);
                        }*/
                    }
                    else {
                        messageHandler.publishError('Could not assign resources. Please refresh and try again.');
                    }
                };

                ctrl.assignmentRedirect = function () {
                    var redirectURL = folders.getKaz_http_server();
                    $window.location.href = redirectURL;
                };

                ctrl.fileCabinetRedirect = function () {
                    var redirectURL = '/file-cabinet?id=' + resourceList.getFolderID();
                    $window.location.href = redirectURL;
                };


                var onError = function(reason) {
                    ctrl.savingData = false;
                    messageHandler.publishError('Failed Assigning Resources. Please refresh and try again.');
                };

                ctrl.showMessage = function(errorMessage) {
                    MessageBox.show({
                        message: errorMessage,
                        responses: [
                            {
                                id: 'ok',
                                confirm: true,
                                label: 'OK'
                            }
                        ]
                    }).then(function (response) {
                        ctrl.messageBoxOpen = false;
                    },function (reason) {
                        alert(errorMessage);
                    });
                };
            }

            self.show = function () {
                ModalService.showModal({
                    controller: ['folders', 'fileCabinetRibbonService', 'resourceList','close','studentList','MessageBox','$http', 'messageHandler', '$window', 'Authorization', 'SiteHelper', '_', AssignResourcesController],
                    controllerAs: '$ctrl',
                    templateUrl: '/shared/js/angular/ui/assign-students.html'
                });
            }
        }

        return new AssignResources();
    }])
