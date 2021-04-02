class Store<T>{

    map = new Map<number,T>()
    counter = 0

    //add some kind of version number or hash verify
    upserts = new Set<number>()
    deletions = new Set<number>()
    versionnumber = 0

    get(id:number){
        return this.map.get(id)
    }

    add(item:T){
        (item as any).id = this.counter++
        return this.insert(item)
    }

    insert(item:any){
        this.map.set((item as any).id,item)
        this.upserts.add(item.id)
        return item
    }

    flag(id:number){
        //would be nicer if flagging was somehow done automatically
        //call this function in the setparent function of entitys
        this.upserts.add(id)
    }

    list(){
        return Array.from(this.map.values())
    }

    remove(id){
        var val = this.map.get(id)
        this.map.delete(id)
        this.deletions.add(id)
        return val
    }

    collectChanges(){
        for(var deletion of this.deletions){
            if(this.upserts.has(deletion)){
                this.deletions.delete(deletion)
                this.upserts.delete(deletion)
            }
        }
        var deletions = Array.from(this.deletions.keys())
        var upserts = Array.from(this.upserts.entries()).map(e => this.get(e[0]))
        this.upserts.clear()
        this.deletions.clear()
        if(upserts.length > 0 || deletions.length > 0){
            this.versionnumber++
        }


        //optimization potential: if delete id present in upserts cancel them both out
        return {
            upserts,
            deletions,
            version:this.versionnumber
        }
    }

    applyChanges(deletions:number[],upserts:any[]){
        for(var upsert of upserts){
            var local = this.get(upsert.id)
            if(local == null){
                this.insert(upsert)
                upsert.__proto__ = Entity.prototype
            }else{
                Object.assign(local,upsert)
            }
        }

        for(var deletion of deletions){
            this.remove(deletion)
        }
    }
}