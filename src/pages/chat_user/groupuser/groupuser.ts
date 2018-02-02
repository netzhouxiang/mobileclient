import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { ChatService } from "../../../providers/chat-service";
/**
 * Generated class for the RegisttipPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-groupuser',
    templateUrl: 'groupuser.html',
})
export class GroupUserPage {
    group_info = null;
    list_user = [];
    qunzhu = "";
    searchKey = "";
    constructor(public navCtrl: NavController, public chatService: ChatService, public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl: ViewController, public nativeService: NativeService) {
        
    }
    showChat(name) {
        return name.indexOf(this.searchKey) > -1;
    }
    go_im(_username) {
        this.navCtrl.push('ChatUserPage', {
            username: _username
        });
    }
    //添加群成员
    adduser() {
        let profileModal = this.modalCtrl.create('SelectUserPage', { users: [] });
        profileModal.onDidDismiss(res => {
            if (res) {
                var username = [];
                for (var i = 0; i < res.length; i++) {
                    username.push("yzwg_" + res[i]._id);
                }
                if (username.length > 0) {
                    (<any>window).JMessage.addGroupMembers({ id: this.group_info.id, usernameArray: username },
                        () => {
                            this.getUser();
                            this.nativeService.showToast("已成功添加");
                        }, (error) => {
                        })
                }
            }
        });
        profileModal.present();
    }
    //获取成员
    getUser() {
        (<any>window).JMessage.getGroupMembers({ id: this.group_info.id },
            (userArray) => {
                this.list_user = userArray;
                this.list_user.forEach(item => {
                    item.uinfo = this.chatService.getUser(item.username);
                });
            }, (error) => {

            })
    }
    //移除成员
    del(uname) {
        (<any>window).JMessage.removeGroupMembers({ id: this.group_info.id, usernameArray: [uname] },
            (userArray) => {
                this.getUser();
                this.nativeService.showToast("移除成功");
            }, (error) => {

            })
    }
    ionViewDidLoad() {
        this.group_info = this.navParams.data.group;
        this.qunzhu = this.group_info.owner;
        this.getUser();

    }
}
